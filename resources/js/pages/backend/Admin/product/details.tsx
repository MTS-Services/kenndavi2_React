import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin-layout";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    PencilLine,
    Trash,
    Star,
    Tag,
    Package,
    ImageOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────── */
/* Types                                                           */
/* ─────────────────────────────────────────────────────────────── */

interface ProductImage {
    id: number;
    url: string;
    alt_text: string | null;
    is_primary: boolean;
    sort_order: number;
}

interface ProductVariant {
    id: number;
    quantity: number;
    status: string;
    color: { id: number; name: string; hex: string } | null;
    size: { id: number; name: string } | null;
}

interface TagItem {
    id: number;
    name: string;
}

interface ProductDetail {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    price: string;
    discount: string | null;
    discount_type: string | null;
    discount_starts_at: string | null;
    discount_ends_at: string | null;
    type: string;
    status: string;
    is_featured: boolean;
    category: { id: number; title: string } | null;
    images: ProductImage[];
    variants: ProductVariant[];
    tags: TagItem[];
    created_at: string;
    updated_at: string;
}

interface PageProps {
    product: ProductDetail;
    activeType?: string;
}

/* ─────────────────────────────────────────────────────────────── */
/* Helpers                                                         */
/* ─────────────────────────────────────────────────────────────── */

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
    });
}

function formatPrice(price: string): string {
    return `$${Number(price).toFixed(2)}`;
}

function discountedPrice(price: string, discount: string | null, type: string | null): string | null {
    if (!discount || !type) return null;
    const p = Number(price);
    const d = Number(discount);
    if (type === "percentage") return `$${(p - p * d / 100).toFixed(2)}`;
    if (type === "fixed") return `$${(p - d).toFixed(2)}`;
    return null;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
    active: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
    inactive: { bg: "bg-stone-100", text: "text-stone-600", dot: "bg-stone-400" },
    draft: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
};

/* ─────────────────────────────────────────────────────────────── */
/* Page                                                            */
/* ─────────────────────────────────────────────────────────────── */

export default function ProductDetails({ product, activeType = "men" }: PageProps) {
    const primaryImage = product.images.find((img) => img.is_primary) ?? product.images[0] ?? null;
    const galleryImages = product.images.filter((img) => img.id !== primaryImage?.id);
    const [activeImage, setActiveImage] = useState<ProductImage | null>(primaryImage);

    const finalPrice = discountedPrice(product.price, product.discount, product.discount_type);
    const statusStyle = STATUS_STYLES[product.status] ?? STATUS_STYLES.inactive;

    // Group variants into a matrix: rows = sizes, cols = colors
    const allSizes = [...new Map(product.variants.map((v) => [v.size?.id, v.size]).filter(([, s]) => s)).values()] as { id: number; name: string }[];
    const allColors = [...new Map(product.variants.map((v) => [v.color?.id, v.color]).filter(([, c]) => c)).values()] as { id: number; name: string; hex: string }[];
    const variantMap = new Map(
        product.variants.map((v) => [`${v.size?.id ?? ""}:${v.color?.id ?? ""}`, v])
    );

    return (
        <AdminLayout
            title={product.title}
            description="Product details and inventory overview."
        >
            <div className="space-y-6">

                {/* ── Top bar ── */}
                <div className="flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={() => router.visit(`${route("admin.products.index")}?type=${activeType}`)}
                        className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors cursor-pointer group"
                    >
                        <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
                        Back to products
                    </button>

                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        <Link
                            href={route("admin.products.edit", product.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-50 text-sm font-medium transition-colors"
                        >
                            <PencilLine className="size-4" /> Edit
                        </Link>
                        <DeleteDialog id={product.id} title={product.title} activeType={activeType} />
                    </div>
                </div>

                {/* ── Main content ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* ── Left — Image gallery ── */}
                    <div className="bg-[#FDF7F7] rounded-lg border border-border-primary p-5 space-y-4">
                        {/* Primary / active image */}
                        <div className="aspect-square rounded-md bg-[#1103040A] overflow-hidden flex items-center justify-center">
                            {activeImage ? (
                                <img
                                    src={activeImage.url}
                                    alt={activeImage.alt_text ?? product.title}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-stone-300">
                                    <ImageOff className="size-12 opacity-40" />
                                    <p className="text-xs">No image</p>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {product.images.map((img) => (
                                    <button
                                        key={img.id}
                                        type="button"
                                        onClick={() => setActiveImage(img)}
                                        className={cn(
                                            "flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all cursor-pointer",
                                            activeImage?.id === img.id
                                                ? "border-red-600 ring-1 ring-red-600"
                                                : "border-transparent hover:border-stone-300"
                                        )}
                                    >
                                        <img
                                            src={img.url}
                                            alt={img.alt_text ?? ""}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right — Product info ── */}
                    <div className="space-y-5">

                        {/* Title + badges */}
                        <div className="bg-[#FDF7F7] rounded-lg border border-border-primary p-5 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h1 className="text-3xl font-bold font-alumni text-stone-900 leading-tight">
                                        {product.title}
                                    </h1>
                                    <p className="text-xs font-mono text-stone-400 mt-1">/{product.slug}</p>
                                </div>
                                {product.is_featured && (
                                    <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full shrink-0 mt-1">
                                        <Star className="size-3 fill-amber-400 text-amber-400" /> Featured
                                    </span>
                                )}
                            </div>

                            {/* Status + Type */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full capitalize", statusStyle.bg, statusStyle.text)}>
                                    <span className={cn("size-1.5 rounded-full", statusStyle.dot)} />
                                    {product.status}
                                </span>
                                <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-[#1103040A] text-stone-600 capitalize">
                                    {product.type}
                                </span>
                                {product.category && (
                                    <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-700">
                                        {product.category.title}
                                    </span>
                                )}
                            </div>

                            {/* Pricing */}
                            <div className="flex items-baseline gap-3 pt-1">
                                {finalPrice ? (
                                    <>
                                        <span className="text-3xl font-bold font-alumni text-red-700">{finalPrice}</span>
                                        <span className="text-lg text-stone-400 line-through font-alumni">{formatPrice(product.price)}</span>
                                        <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                            {product.discount_type === "percentage"
                                                ? `${product.discount}% off`
                                                : `$${product.discount} off`}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-3xl font-bold font-alumni text-stone-900">{formatPrice(product.price)}</span>
                                )}
                            </div>

                            {/* Discount window */}
                            {(product.discount_starts_at || product.discount_ends_at) && (
                                <p className="text-xs text-stone-400">
                                    Offer period:{" "}
                                    <span className="text-stone-600">
                                        {product.discount_starts_at ? formatDate(product.discount_starts_at) : "—"}
                                        {" → "}
                                        {product.discount_ends_at ? formatDate(product.discount_ends_at) : "ongoing"}
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="bg-[#FDF7F7] rounded-lg border border-border-primary p-5">
                                <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wide mb-2">Description</h2>
                                <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Tags */}
                        {product.tags.length > 0 && (
                            <div className="bg-[#FDF7F7] rounded-lg border border-border-primary p-5">
                                <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                    <Tag className="size-3.5" /> Tags
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag) => (
                                        <Badge key={tag.id} variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-100">
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Meta */}
                        <div className="bg-[#FDF7F7] rounded-lg border border-border-primary p-5">
                            <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wide mb-3">Info</h2>
                            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                <dt className="text-stone-400">Created</dt>
                                <dd className="text-stone-700 font-medium">{formatDate(product.created_at)}</dd>
                                <dt className="text-stone-400">Last updated</dt>
                                <dd className="text-stone-700 font-medium">{formatDate(product.updated_at)}</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* ── Variants table ── */}
                {product.variants.length > 0 && (
                    <div className="bg-[#FDF7F7] rounded-lg border border-border-primary p-5">
                        <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wide mb-4 flex items-center gap-1.5">
                            <Package className="size-3.5" /> Variants & Stock
                        </h2>

                        {/* Matrix layout when both sizes and colors exist */}
                        {allSizes.length > 0 && allColors.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr>
                                            <th className="text-left text-xs font-semibold text-stone-400 pb-2 pr-4">Size \ Color</th>
                                            {allColors.map((color) => (
                                                <th key={color.id} className="text-center text-xs font-semibold text-stone-700 pb-2 px-3 min-w-[80px]">
                                                    <span className="flex items-center justify-center gap-1.5">
                                                        <span
                                                            className="inline-block size-3 rounded-full border border-stone-200 shrink-0"
                                                            style={{ backgroundColor: color.hex }}
                                                        />
                                                        {color.name}
                                                    </span>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {allSizes.map((size) => (
                                            <tr key={size.id}>
                                                <td className="py-2 pr-4 font-medium text-stone-700">{size.name}</td>
                                                {allColors.map((color) => {
                                                    const variant = variantMap.get(`${size.id}:${color.id}`);
                                                    const qty = variant?.quantity ?? null;
                                                    return (
                                                        <td key={color.id} className="py-2 px-3 text-center">
                                                            {qty !== null ? (
                                                                <span className={cn(
                                                                    "inline-block px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                                    qty === 0 ? "bg-red-50 text-red-600" :
                                                                        qty <= 5 ? "bg-amber-50 text-amber-700" :
                                                                            "bg-green-50 text-green-700"
                                                                )}>
                                                                    {qty}
                                                                </span>
                                                            ) : (
                                                                <span className="text-stone-200">—</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            /* Flat list fallback (no size/color axis) */
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {product.variants.map((v) => (
                                    <div key={v.id} className="flex items-center justify-between gap-2 bg-[#1103040A] rounded-md px-3 py-2">
                                        <span className="text-sm text-stone-700 font-medium">
                                            {[v.size?.name, v.color?.name].filter(Boolean).join(" / ") || `#${v.id}`}
                                        </span>
                                        <span className={cn(
                                            "text-xs font-semibold px-2 py-0.5 rounded-full",
                                            v.quantity === 0 ? "bg-red-50 text-red-600" :
                                                v.quantity <= 5 ? "bg-amber-50 text-amber-700" :
                                                    "bg-green-50 text-green-700"
                                        )}>
                                            {v.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Stock legend */}
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-stone-100 text-xs text-stone-400">
                            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-green-400" /> In stock (6+)</span>
                            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-400" /> Low (1–5)</span>
                            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-red-400" /> Out of stock</span>
                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/* DeleteDialog                                                    */
/* ─────────────────────────────────────────────────────────────── */

function DeleteDialog({
    id,
    title,
    activeType,
}: {
    id: number;
    title: string;
    activeType: string;
}) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(route("admin.products.destroy", id), {
            data: { type: activeType },
            onSuccess: () => setOpen(false),
            onError: () => {
                const { toast: t } = require("sonner");
                t.error("Failed to delete. Please try again.");
            },
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors cursor-pointer"
            >
                <Trash className="size-4" /> Delete
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md bg-[#FDF7F7]">
                    <DialogHeader>
                        <DialogTitle className="font-alumni">
                            <span className="text-2xl font-bold">Delete "{title}"?</span>
                            <br />
                            <span className="text-stone-400 text-base font-normal">
                                This action cannot be undone.
                            </span>
                        </DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className="font-normal cursor-pointer">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" className="font-normal cursor-pointer" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}