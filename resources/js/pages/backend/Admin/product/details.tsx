import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    ImageOff,
    Package,
    PencilLine,
    Star,
    Trash,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

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

interface SizeOption {
    id: number;
    name: string;
}
interface ColorOption {
    id: number;
    name: string;
    hex: string;
}

interface ProductVariant {
    id: number;
    quantity: number;
    status: string;
    color: ColorOption | null;
    size: SizeOption | null;
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
    is_new: boolean;
    category: { id: number; title: string } | null;
    subcategory: { id: number; title: string } | null;
    images: ProductImage[];
    variants: ProductVariant[];
    tags: TagItem[];
    created_at: string;
    updated_at: string;
}

interface PageProps {
    product: ProductDetail;
    activeType?: string;
    frontendUrl?: string;
}

/* ─────────────────────────────────────────────────────────────── */
/* Helpers                                                         */
/* ─────────────────────────────────────────────────────────────── */

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatPrice(price: string): string {
    return `$${Number(price).toFixed(2)}`;
}

function discountedPrice(
    price: string,
    discount: string | null,
    type: string | null,
): string | null {
    if (!discount || !type) return null;
    const p = Number(price);
    const d = Number(discount);
    if (type === 'percentage') return `$${(p - (p * d) / 100).toFixed(2)}`;
    if (type === 'fixed') return `$${(p - d).toFixed(2)}`;
    return null;
}

/*
 * Deduplicate variant sizes/colors by id.
 *
 * The previous one-liner used [...new Map(arr.filter(...))] which produces
 * a type that TypeScript cannot assign to Iterable<readonly [unknown, unknown]>,
 * causing TS2769. Using a plain reduce into a Map avoids the issue entirely.
 */
function uniqueSizes(variants: ProductVariant[]): SizeOption[] {
    const seen = new Map<number, SizeOption>();
    for (const v of variants) {
        if (v.size && !seen.has(v.size.id)) seen.set(v.size.id, v.size);
    }
    return Array.from(seen.values());
}

function uniqueColors(variants: ProductVariant[]): ColorOption[] {
    const seen = new Map<number, ColorOption>();
    for (const v of variants) {
        if (v.color && !seen.has(v.color.id)) seen.set(v.color.id, v.color);
    }
    return Array.from(seen.values());
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> =
    {
        active: {
            bg: 'bg-green-50',
            text: 'text-green-700',
            dot: 'bg-green-500',
        },
        inactive: {
            bg: 'bg-stone-100',
            text: 'text-stone-600',
            dot: 'bg-stone-400',
        },
        draft: {
            bg: 'bg-amber-50',
            text: 'text-amber-700',
            dot: 'bg-amber-400',
        },
    };

/* ─────────────────────────────────────────────────────────────── */
/* Page                                                            */
/* ─────────────────────────────────────────────────────────────── */

export default function ProductDetails({
    product,
    activeType = 'men',
    frontendUrl,
}: PageProps) {
    const primaryImage =
        product.images.find((img) => img.is_primary) ??
        product.images[0] ??
        null;
    const [activeImage, setActiveImage] = useState<ProductImage | null>(
        primaryImage,
    );

    const finalPrice = discountedPrice(
        product.price,
        product.discount,
        product.discount_type,
    );
    const statusStyle = STATUS_STYLES[product.status] ?? STATUS_STYLES.inactive;

    // Build the variant matrix — properly typed, no TS2769
    const allSizes = uniqueSizes(product.variants);
    const allColors = uniqueColors(product.variants);

    // Lookup map keyed by "sizeId:colorId"
    const variantMap = new Map<string, ProductVariant>(
        product.variants.map((v) => [
            `${v.size?.id ?? ''}:${v.color?.id ?? ''}`,
            v,
        ]),
    );

    // ── Download as SVG ──────────────────────────────────────────────
    const qrRef = useRef<SVGSVGElement>(null);
    const downloadSVG = () => {
        const svg = qrRef.current;
        if (!svg) return;

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const blob = new Blob([svgString], {
            type: 'image/svg+xml;charset=utf-8',
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${product.title}-qrcode.svg`;
        a.click();
        URL.revokeObjectURL(url);
    };

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
                        onClick={() =>
                            router.visit(
                                `${route('admin.products.index')}?type=${activeType}`,
                            )
                        }
                        className="group flex cursor-pointer items-center gap-2 text-sm text-stone-500 transition-colors hover:text-stone-800"
                    >
                        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                        Back to products
                    </button>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.products.edit', product.id)}
                            className="flex items-center gap-2 rounded-md border border-green-600 px-4 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-50"
                        >
                            <PencilLine className="size-4" /> Edit
                        </Link>
                        <DeleteDialog
                            id={product.id}
                            title={product.title}
                            activeType={activeType}
                        />
                    </div>
                </div>

                {/* ── Main content grid ── */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* ── Left — Image gallery ── */}
                    <div className="border-border-primary space-y-4 rounded-lg border bg-[#FDF7F7] p-5">
                        {/* Active image */}
                        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-[#1103040A]">
                            {activeImage ? (
                                <img
                                    src={activeImage.url}
                                    alt={activeImage.alt_text ?? product.title}
                                    className="h-full w-full object-contain"
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
                                            'h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-all',
                                            activeImage?.id === img.id
                                                ? 'border-red-600 ring-1 ring-red-600'
                                                : 'border-transparent hover:border-stone-300',
                                        )}
                                    >
                                        <img
                                            src={img.url}
                                            alt={img.alt_text ?? ''}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right — Product info ── */}
                    <div className="space-y-5">
                        {/* Title + badges */}
                        <div className="border-border-primary space-y-3 rounded-lg border bg-[#FDF7F7] p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h1 className="font-alumni text-3xl leading-tight font-bold text-stone-900">
                                        {product.title}
                                    </h1>
                                    <p className="mt-1 font-mono text-xs text-stone-400">
                                        /{product.slug}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {product.is_featured && (
                                        <span className="mt-1 flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                                            <Star className="size-3 fill-amber-400 text-amber-400" />{' '}
                                            Featured
                                        </span>
                                    )}
                                    {product.is_new && (
                                        <span className="mt-1 flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                                            <Clock className="size-3 stroke-emerald-400 text-emerald-400" />{' '}
                                            New Arrival
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Status + Type + Category */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className={cn(
                                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                                        statusStyle.bg,
                                        statusStyle.text,
                                    )}
                                >
                                    <strong className="pr-1 font-bold">
                                        Status:
                                    </strong>
                                    <span
                                        className={cn(
                                            'size-1.5 rounded-full',
                                            statusStyle.dot,
                                        )}
                                    />
                                    {product.status}
                                </span>
                                <span className="inline-flex items-center rounded-full bg-[#1103040A] px-2.5 py-1 text-xs font-medium text-stone-600 capitalize">
                                    <strong className="pr-1 font-bold">
                                        Type:
                                    </strong>
                                    {product.type}
                                </span>
                                {product.category && (
                                    <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                                        <strong className="pr-1 font-bold">
                                            Category:
                                        </strong>
                                        {product.category.title}
                                    </span>
                                )}
                                {product.subcategory && (
                                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                        <strong className="pr-1 font-bold">
                                            Subcategory:
                                        </strong>
                                        {product.subcategory.title}
                                    </span>
                                )}
                            </div>

                            {/* Pricing */}
                            <div className="flex items-baseline gap-3 pt-1">
                                {finalPrice ? (
                                    <>
                                        <span className="font-alumni text-3xl font-bold text-red-700">
                                            {finalPrice}
                                        </span>
                                        <span className="font-alumni text-lg text-stone-400 line-through">
                                            {formatPrice(product.price)}
                                        </span>
                                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                                            {product.discount_type ===
                                            'percentage'
                                                ? `${product.discount}% off`
                                                : `$${product.discount} off`}
                                        </span>
                                    </>
                                ) : (
                                    <span className="font-alumni text-3xl font-bold text-stone-900">
                                        {formatPrice(product.price)}
                                    </span>
                                )}
                            </div>

                            {/* Discount window */}
                            {(product.discount_starts_at ||
                                product.discount_ends_at) && (
                                <p className="text-xs text-stone-400">
                                    Offer period:{' '}
                                    <span className="text-stone-600">
                                        {product.discount_starts_at
                                            ? formatDate(
                                                  product.discount_starts_at,
                                              )
                                            : '—'}
                                        {' → '}
                                        {product.discount_ends_at
                                            ? formatDate(
                                                  product.discount_ends_at,
                                              )
                                            : 'ongoing'}
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="border-border-primary rounded-lg border bg-[#FDF7F7] p-5">
                                <h2 className="mb-2 text-sm font-bold tracking-wide text-stone-500 uppercase">
                                    Description
                                </h2>
                                <p className="text-sm leading-relaxed whitespace-pre-line text-stone-700">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Tags */}
                        {/* {product.tags.length > 0 && (
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
                        )} */}

                        {/* Meta */}
                        <div className="border-border-primary rounded-lg border bg-[#FDF7F7] p-5">
                            <h2 className="mb-3 text-sm font-bold tracking-wide text-stone-500 uppercase">
                                Info
                            </h2>
                            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                <dt className="text-stone-400">Created</dt>
                                <dd className="font-medium text-stone-700">
                                    {formatDate(product.created_at)}
                                </dd>
                                <dt className="text-stone-400">Last updated</dt>
                                <dd className="font-medium text-stone-700">
                                    {formatDate(product.updated_at)}
                                </dd>
                            </dl>
                        </div>
                        <div className="space-y-3">
                            <div className="flex w-fit flex-col items-center rounded bg-white p-4 shadow">
                                <QRCodeSVG
                                    ref={qrRef}
                                    value={frontendUrl}
                                    size={200}
                                />
                                <p className="mt-2 text-xs text-gray-500">
                                    Scan to View
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={downloadSVG}
                                    className="flex cursor-pointer items-center gap-2 rounded-md border border-green-600 px-4 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-50"
                                >
                                    ↓ SVG
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Variants table ── */}
                {product.variants.length > 0 && (
                    <div className="border-border-primary rounded-lg border bg-[#FDF7F7] p-5">
                        <h2 className="mb-4 flex items-center gap-1.5 text-sm font-bold tracking-wide text-stone-500 uppercase">
                            <Package className="size-3.5" /> Variants & Stock
                        </h2>

                        {allSizes.length > 0 && allColors.length > 0 ? (
                            /* Matrix: rows = sizes, cols = colors */
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr>
                                            <th className="pr-4 pb-2 text-left text-xs font-semibold text-stone-400">
                                                Size \ Color
                                            </th>
                                            {allColors.map((color) => (
                                                <th
                                                    key={color.id}
                                                    className="min-w-[80px] px-3 pb-2 text-center text-xs font-semibold text-stone-700"
                                                >
                                                    <span className="flex items-center justify-center gap-1.5">
                                                        <span
                                                            className="inline-block size-3 shrink-0 rounded-full border border-stone-200"
                                                            style={{
                                                                backgroundColor:
                                                                    color.hex,
                                                            }}
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
                                                <td className="py-2 pr-4 font-medium text-stone-700">
                                                    {size.name}
                                                </td>
                                                {allColors.map((color) => {
                                                    const variant =
                                                        variantMap.get(
                                                            `${size.id}:${color.id}`,
                                                        );
                                                    const qty =
                                                        variant?.quantity ??
                                                        null;
                                                    return (
                                                        <td
                                                            key={color.id}
                                                            className="px-3 py-2 text-center"
                                                        >
                                                            {qty !== null ? (
                                                                <span
                                                                    className={cn(
                                                                        'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                                                                        qty ===
                                                                            0
                                                                            ? 'bg-red-50 text-red-600'
                                                                            : qty <=
                                                                                5
                                                                              ? 'bg-amber-50 text-amber-700'
                                                                              : 'bg-green-50 text-green-700',
                                                                    )}
                                                                >
                                                                    {qty}
                                                                </span>
                                                            ) : (
                                                                <span className="text-stone-200">
                                                                    —
                                                                </span>
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
                            /* Flat list fallback */
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                {product.variants.map((v) => (
                                    <div
                                        key={v.id}
                                        className="flex items-center justify-between gap-2 rounded-md bg-[#1103040A] px-3 py-2"
                                    >
                                        <span className="text-sm font-medium text-stone-700">
                                            {[v.size?.name, v.color?.name]
                                                .filter(Boolean)
                                                .join(' / ') || `#${v.id}`}
                                        </span>
                                        <span
                                            className={cn(
                                                'rounded-full px-2 py-0.5 text-xs font-semibold',
                                                v.quantity === 0
                                                    ? 'bg-red-50 text-red-600'
                                                    : v.quantity <= 5
                                                      ? 'bg-amber-50 text-amber-700'
                                                      : 'bg-green-50 text-green-700',
                                            )}
                                        >
                                            {v.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Legend */}
                        <div className="mt-4 flex items-center gap-4 border-t border-stone-100 pt-4 text-xs text-stone-400">
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-green-400" />{' '}
                                In stock (6+)
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-amber-400" />{' '}
                                Low (1–5)
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-red-400" />{' '}
                                Out of stock
                            </span>
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
        router.delete(route('admin.products.destroy', id), {
            data: { type: activeType },
            onSuccess: () => setOpen(false),
            onError: () => toast.error('Failed to delete. Please try again.'),
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
                <Trash className="size-4" /> Delete
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md bg-[#FDF7F7]">
                    <DialogHeader>
                        <DialogTitle className="font-alumni">
                            <span className="text-2xl font-bold">
                                Delete "{title}"?
                            </span>
                            <br />
                            <span className="text-base font-normal text-stone-400">
                                This action cannot be undone.
                            </span>
                        </DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                className="cursor-pointer font-normal"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            className="cursor-pointer font-normal"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
