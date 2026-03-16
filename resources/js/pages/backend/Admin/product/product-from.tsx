import { useState } from "react";
import { useForm, router, Link } from "@inertiajs/react";
import { toast } from "sonner";
import AdminLayout from "@/layouts/admin-layout";
import InputError from "@/components/input-error";
import FileUpload from "@/components/file-upload";
import { X } from "lucide-react";

/* ─────────────────────────────────────────────────────────────── */
/* Types                                                           */
/* ─────────────────────────────────────────────────────────────── */

const TOTAL_SLOTS = 5; // slot 0 = primary, slots 1-4 = additional

interface ExistingImage {
    id: number | string;
    path: string;
    url: string;
    mime_type: string;
    name?: string;
    size?: number;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: number | null;
    primary_image?: ExistingImage | null;
    images?: ExistingImage[]; // up to 4 additional
}

export interface CategoryForSelect {
    id: number;
    title: string;
}

interface PageProps {
    product?: Product;
    categories?: CategoryForSelect[];
}

// _method in form data = correct Laravel PUT spoof for multipart uploads.
// Never put it in submit options — that causes TS2353.
interface ProductFormData {
    _method: "PUT" | "";
    name: string;
    description: string;
    price: string;
    stock: string;
    category_id: string;
    primary_image: File | null;
    images: (File | null)[]; // index 0-3 = additional slots 1-4
    removed_image_ids: number[];
}

/* ─────────────────────────────────────────────────────────────── */
/* Page                                                            */
/* ─────────────────────────────────────────────────────────────── */

export default function ProductForm({ product, categories = [] }: PageProps) {
    const isEdit = Boolean(product?.id);

    // Additional existing images keyed by slot index (0-3 → display slots 1-4)
    const [existingImages, setExistingImages] = useState<(ExistingImage | null)[]>(
        () => {
            const filled = product?.images ?? [];
            // Pad to 4 slots so indices are stable
            return Array.from({ length: TOTAL_SLOTS - 1 }, (_, i) => filled[i] ?? null);
        }
    );

    const { data, setData, post, processing, errors } = useForm<ProductFormData>({
        _method: isEdit ? "PUT" : "",
        name: product?.name ?? "",
        description: product?.description ?? "",
        price: product?.price != null ? String(product.price) : "",
        stock: product?.stock != null ? String(product.stock) : "",
        category_id: product?.category_id != null ? String(product.category_id) : "",
        primary_image: null,
        images: Array(TOTAL_SLOTS - 1).fill(null),
        removed_image_ids: [],
    });

    // Update a single slot in the images array immutably
    const setImageSlot = (slotIndex: number, file: File | null) => {
        const updated = [...data.images];
        updated[slotIndex] = file;
        setData("images", updated);
    };

    // Remove an existing image from an additional slot
    const handleRemoveExisting = (slotIndex: number, id: number | string) => {
        const updatedExisting = [...existingImages];
        updatedExisting[slotIndex] = null;
        setExistingImages(updatedExisting);
        setData("removed_image_ids", [...data.removed_image_ids, Number(id)]);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(
            isEdit
                ? route("admin.products.update", product!.id)
                : route("admin.products.store"),
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => router.visit(route("admin.products.index")),
                onError: (errs: Record<string, string>) => {
                    const first = Object.values(errs)[0];
                    if (first) toast.error(first);
                },
            }
        );
    };

    return (
        <AdminLayout
            title={isEdit ? "Edit Product" : "Add New Product"}
            description={
                isEdit
                    ? "Update the product details below."
                    : "Fill in the details to add a new product."
            }
        >
            <div className="bg-[var(--bg-animation)] w-full p-8 rounded-lg shadow-lg">
                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-stone-900 font-alumni">
                        {isEdit ? "Edit Product" : "Add New Product"}
                    </h2>
                    <Link
                        href={route("admin.products.index")}
                        className="bg-red-600 hover:bg-red-700 text-white p-1 rounded transition-colors cursor-pointer"
                    >
                        <X className="size-4" />
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6">

                    {/* ── 5 image slots ────────────────────────────────── */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {/* Slot 0 — Primary */}
                        <div className="flex flex-col gap-1">
                            <FileUpload
                                value={data.primary_image}
                                onChange={(file) =>
                                    setData("primary_image", file as File | null)
                                }
                                existingFiles={
                                    isEdit && product?.primary_image
                                        ? [product.primary_image]
                                        : []
                                }
                                accept="image/*"
                                maxSize={10}
                                maxFiles={1}
                                error={errors.primary_image}
                                innerClassName="aspect-7/5 flex items-center justify-center bg-[#1103040A]"
                            />
                        </div>

                        {/* Slots 1-4 — Additional */}
                        {Array.from({ length: TOTAL_SLOTS - 1 }, (_, i) => {
                            const existing = existingImages[i];
                            return (
                                <div key={i} className="flex flex-col gap-1">
                                    <FileUpload
                                        value={data.images[i]}
                                        onChange={(file) =>
                                            setImageSlot(i, file as File | null)
                                        }
                                        existingFiles={existing ? [existing] : []}
                                        onRemoveExisting={(id) =>
                                            handleRemoveExisting(i, id)
                                        }
                                        accept="image/*"
                                        maxSize={10}
                                        maxFiles={1}
                                        error={
                                            (errors as Record<string, string>)[
                                            `images.${i}`
                                            ]
                                        }
                                        innerClassName="aspect-7/5 flex items-center justify-center bg-[#1103040A]"
                                    />
                                </div>
                            );
                        })}
                    </div>
                    {/* ── Title ────────────────────────────────────────── */}
                    <div>
                        <label className="block text-lg font-bold text-stone-900 mb-2 font-alumni">
                            Title
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Enter title"
                            className="w-full bg-[var(--bg-grayslight)] border-none rounded p-3 focus:ring-2 focus:ring-red-600 outline-none"
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* ── Description ──────────────────────────────────── */}
                    <div>
                        <label className="block text-lg font-bold text-stone-900 mb-2 font-alumni">
                            Description
                        </label>
                        <textarea
                            rows={6}
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            placeholder="Enter description"
                            className="w-full bg-[var(--bg-grayslight)] border-none rounded p-3 focus:ring-2 focus:ring-red-600 outline-none resize-none"
                        />
                        <InputError message={errors.description} />
                    </div>

                    {/* ── Category / Stock / Price ─────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Category */}
                        <div>
                            <label className="block text-base font-bold text-stone-900 mb-2 font-alumni">
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData("category_id", e.target.value)}
                                    className="w-full bg-[var(--bg-grayslight)] border-none rounded p-3 appearance-none focus:ring-2 focus:ring-red-600 outline-none"
                                >
                                    <option value="">No category</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.title}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-4 w-4 text-stone-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <InputError message={errors.category_id} />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-base font-bold text-stone-900 mb-2 font-alumni">
                                Stock Level
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={data.stock}
                                onChange={(e) => setData("stock", e.target.value)}
                                placeholder="10"
                                className="w-full bg-[var(--bg-grayslight)] border-none rounded p-3 focus:ring-2 focus:ring-red-600 outline-none"
                                required
                            />
                            <InputError message={errors.stock} />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-base font-bold text-stone-900 mb-2 font-alumni">
                                Price
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.price}
                                onChange={(e) => setData("price", e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-[var(--bg-grayslight)] border-none rounded p-3 focus:ring-2 focus:ring-red-600 outline-none"
                                required
                            />
                            <InputError message={errors.price} />
                        </div>
                    </div>

                    {/* ── Submit ────────────────────────────────────────── */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white px-10 py-3 rounded shadow-md transition-all font-medium cursor-pointer"
                        >
                            {processing
                                ? "Saving..."
                                : isEdit
                                    ? "Update Product"
                                    : "Upload"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}