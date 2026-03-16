import { useMemo, useState } from "react";
import { useForm, router, Link } from "@inertiajs/react";
import { toast } from "sonner";
import AdminLayout from "@/layouts/admin-layout";
import InputError from "@/components/input-error";
import FileUpload from "@/components/file-upload";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────── */
/* Types                                                           */
/* ─────────────────────────────────────────────────────────────── */

const TOTAL_SLOTS = 5;

interface ExistingImage {
    id: number | string;
    path: string;
    url: string;
    mime_type: string;
    name?: string;
    size?: number;
}

/** A slim subcategory entry (just id + title) */
interface SubcategoryForSelect {
    id: number;
    title: string;
}

/**
 * A top-level category that already carries its children (subcategories).
 * The controller eager-loads them via ->with('children:id,title').
 */
export interface CategoryForSelect {
    id: number;
    title: string;
    children: SubcategoryForSelect[]; // always present (may be [])
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: number | null;
    subcategory_id: number | null;
    primary_image?: ExistingImage | null;
    images?: ExistingImage[];
}

interface VariantRow {
    id: string;
    size: string;
    color: string;
    quantity: string;
}

export type DiscountType = "fixed" | "percent" | "";

interface PageProps {
    product?: Product;
    categories?: CategoryForSelect[];
    discountTypes?: DiscountType[];
}

interface ProductFormData {
    _method: "PUT" | "";
    name: string;
    description: string;
    price: string;
    discount_type: DiscountType;
    discount_value: string;
    stock: string;
    category_id: string;
    subcategory_id: string;
    primary_image: File | null;
    images: (File | null)[];
    removed_image_ids: number[];
}

/* ─────────────────────────────────────────────────────────────── */
/* Field primitives                                                */
/* ─────────────────────────────────────────────────────────────── */

function Field({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
}

function FieldGroup({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("flex flex-col gap-6", className)}>{children}</div>;
}

function FieldSet({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <fieldset className={cn("border-0 p-0 m-0 min-w-0", className)}>
            {children}
        </fieldset>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/* Shared style                                                    */
/* ─────────────────────────────────────────────────────────────── */

const fieldStyle =
    "bg-[#1103040A] border-0 rounded-md focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-0 shadow-none h-11 text-stone-800 placeholder:text-stone-400";

/* ─────────────────────────────────────────────────────────────── */
/* Page                                                            */
/* ─────────────────────────────────────────────────────────────── */

export default function ProductForm({
    product,
    categories = [],
    discountTypes = [],
}: PageProps) {
    const isEdit = Boolean(product?.id);

    /* ── Existing additional images ── */
    const [existingImages, setExistingImages] = useState<(ExistingImage | null)[]>(
        () => {
            const filled = product?.images ?? [];
            return Array.from({ length: TOTAL_SLOTS - 1 }, (_, i) => filled[i] ?? null);
        }
    );

    /* ── Variants ── */
    const [variants, setVariants] = useState<VariantRow[]>([
        { id: crypto.randomUUID(), size: "", color: "", quantity: "" },
    ]);

    const addVariant = () =>
        setVariants((prev) => [
            ...prev,
            { id: crypto.randomUUID(), size: "", color: "", quantity: "" },
        ]);

    const removeVariant = (id: string) =>
        setVariants((prev) => prev.filter((v) => v.id !== id));

    const updateVariant = (
        id: string,
        field: keyof Omit<VariantRow, "id">,
        value: string
    ) =>
        setVariants((prev) =>
            prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
        );

    /* ── Inertia form ── */
    const { data, setData, post, processing, errors } = useForm<ProductFormData>({
        _method: isEdit ? "PUT" : "",
        name: product?.name ?? "",
        description: product?.description ?? "",
        price: product?.price != null ? String(product.price) : "",
        discount_type: "",
        discount_value: "",
        stock: product?.stock != null ? String(product.stock) : "",
        category_id: product?.category_id != null ? String(product.category_id) : "",
        subcategory_id:
            product?.subcategory_id != null ? String(product.subcategory_id) : "",
        primary_image: null,
        images: Array(TOTAL_SLOTS - 1).fill(null),
        removed_image_ids: [],
    });

    /* ────────────────────────────────────────────────────────────
     * Derived: subcategories that belong to the selected category.
     * We look up the selected category object in the prop list and
     * return its `children` array — already eager-loaded by Laravel.
     * ──────────────────────────────────────────────────────────── */
    const filteredSubcategories = useMemo<SubcategoryForSelect[]>(() => {
        if (!data.category_id) return [];
        const selected = categories.find((c) => String(c.id) === data.category_id);
        return selected?.children ?? [];
    }, [data.category_id, categories]);

    /* Subcategory select is only enabled when a category is chosen
       AND that category actually has children. */
    const subcategoryDisabled = !data.category_id || filteredSubcategories.length === 0;

    /* ── Category change: reset subcategory whenever parent changes ── */
    const handleCategoryChange = (value: string) => {
        setData("category_id", value);
        setData("subcategory_id", ""); // reset stale subcategory
    };

    /* ── Image helpers ── */
    const setImageSlot = (slotIndex: number, file: File | null) => {
        const updated = [...data.images];
        updated[slotIndex] = file;
        setData("images", updated);
    };

    const handleRemoveExisting = (slotIndex: number, id: number | string) => {
        const updatedExisting = [...existingImages];
        updatedExisting[slotIndex] = null;
        setExistingImages(updatedExisting);
        setData("removed_image_ids", [...data.removed_image_ids, Number(id)]);
    };

    /* ── Discount type change: reset value ── */
    const handleDiscountTypeChange = (value: string) => {
        setData("discount_type", value as DiscountType);
        setData("discount_value", "");
    };

    /* ── Submit ── */
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

    const discountPlaceholder =
        data.discount_type === "percent"
            ? "e.g. 10"
            : data.discount_type === "fixed"
                ? "e.g. 5.00"
                : "Set type first";

    return (
        <AdminLayout
            title={isEdit ? "Edit Product" : "Add New Product"}
            description={
                isEdit
                    ? "Update the product details below."
                    : "Fill in the details to add a new product."
            }
        >
            <div className="bg-[#FDF7F7] w-full p-8 rounded-lg shadow-lg">

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-stone-900 font-alumni">
                        {isEdit ? "Edit Product" : "Add new Product"}
                    </h2>
                    <Link
                        href={route("admin.products.index")}
                        className="bg-red-700 hover:bg-red-800 text-white p-1.5 rounded transition-colors cursor-pointer"
                    >
                        <X className="size-4" />
                    </Link>
                </div>

                <form onSubmit={submit}>
                    <FieldGroup>

                        {/* ════════════════════════════════════════════════
                            ROW 1 — Image Slots (max 5)
                        ════════════════════════════════════════════════ */}
                        <FieldSet>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <Field>
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
                                        innerClassName="aspect-7/5 flex items-center justify-center bg-[#1103040A] rounded-md"
                                    />
                                </Field>

                                {Array.from({ length: TOTAL_SLOTS - 1 }, (_, i) => {
                                    const existing = existingImages[i];
                                    return (
                                        <Field key={i}>
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
                                                innerClassName="aspect-7/5 flex items-center justify-center bg-[#1103040A] rounded-md"
                                            />
                                        </Field>
                                    );
                                })}
                            </div>
                        </FieldSet>

                        {/* ════════════════════════════════════════════════
                            ROW 2 — Title
                        ════════════════════════════════════════════════ */}
                        <FieldSet>
                            <Field>
                                <Label className="text-base font-bold text-stone-900 font-alumni">
                                    Title
                                </Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    placeholder="Enter title"
                                    className={fieldStyle}
                                    required
                                />
                                <InputError message={errors.name} />
                            </Field>
                        </FieldSet>

                        {/* ════════════════════════════════════════════════
                            ROW 3 — Category + Subcategory
                        ════════════════════════════════════════════════ */}
                        <FieldSet>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Category */}
                                <Field>
                                    <Label className="text-base font-bold text-stone-900 font-alumni">
                                        Category
                                    </Label>
                                    <Select
                                        value={data.category_id}
                                        onValueChange={handleCategoryChange}
                                    >
                                        <SelectTrigger className={cn(fieldStyle, "w-full")}>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>
                                                    {c.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category_id} />
                                </Field>

                                {/* Subcategory — disabled until a category with children is chosen */}
                                <Field>
                                    <Label
                                        className={cn(
                                            "text-base font-bold font-alumni transition-colors duration-200",
                                            subcategoryDisabled
                                                ? "text-stone-400"
                                                : "text-stone-900"
                                        )}
                                    >
                                        Subcategory
                                    </Label>
                                    <Select
                                        value={data.subcategory_id}
                                        onValueChange={(v) => setData("subcategory_id", v)}
                                        disabled={subcategoryDisabled}
                                    >
                                        <SelectTrigger
                                            className={cn(
                                                fieldStyle,
                                                "w-full transition-opacity duration-200",
                                                subcategoryDisabled &&
                                                "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            <SelectValue
                                                placeholder={
                                                    !data.category_id
                                                        ? "Select a category first"
                                                        : filteredSubcategories.length === 0
                                                            ? "No subcategories available"
                                                            : "Select subcategory"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredSubcategories.map((s) => (
                                                <SelectItem key={s.id} value={String(s.id)}>
                                                    {s.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>

                            </div>
                        </FieldSet>

                        {/* ════════════════════════════════════════════════
                            ROW 4 — Price · Discount Type · Discount Value
                        ════════════════════════════════════════════════ */}
                        <FieldSet>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                {/* Price */}
                                <Field>
                                    <Label className="text-base font-bold text-stone-900 font-alumni">
                                        Price
                                    </Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData("price", e.target.value)}
                                        placeholder="0.00"
                                        className={fieldStyle}
                                        required
                                    />
                                    <InputError message={errors.price} />
                                </Field>

                                {/* Discount Type */}
                                <Field>
                                    <Label className="text-base font-bold text-stone-900 font-alumni">
                                        Discount Type
                                    </Label>
                                    <Select
                                        value={data.discount_type}
                                        onValueChange={handleDiscountTypeChange}
                                    >
                                        <SelectTrigger className={cn(fieldStyle, "w-full")}>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fixed">Fixed (amount)</SelectItem>
                                            <SelectItem value="percent">Percent (%)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                {/* Discount Value — disabled until type chosen */}
                                <Field>
                                    <Label
                                        className={cn(
                                            "text-base font-bold font-alumni transition-colors duration-200",
                                            data.discount_type
                                                ? "text-stone-900"
                                                : "text-stone-400"
                                        )}
                                    >
                                        Discount Value
                                        {data.discount_type === "percent" && (
                                            <span className="ml-1 text-sm font-normal text-stone-500">
                                                (%)
                                            </span>
                                        )}
                                        {data.discount_type === "fixed" && (
                                            <span className="ml-1 text-sm font-normal text-stone-500">
                                                (amount)
                                            </span>
                                        )}
                                    </Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        step={data.discount_type === "percent" ? "1" : "0.01"}
                                        max={
                                            data.discount_type === "percent" ? "100" : undefined
                                        }
                                        value={data.discount_value}
                                        onChange={(e) =>
                                            setData("discount_value", e.target.value)
                                        }
                                        placeholder={discountPlaceholder}
                                        disabled={!data.discount_type}
                                        className={cn(
                                            fieldStyle,
                                            "transition-opacity duration-200",
                                            !data.discount_type && "opacity-50 cursor-not-allowed"
                                        )}
                                    />
                                </Field>

                            </div>
                        </FieldSet>

                        {/* ════════════════════════════════════════════════
                            ROW 5 — Variants (Size · Color · Stock)
                        ════════════════════════════════════════════════ */}
                        <FieldSet>
                            <div className="flex flex-col gap-3">
                                {variants.map((variant, idx) => (
                                    <div
                                        key={variant.id}
                                        className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end"
                                    >
                                        {/* Size */}
                                        <Field>
                                            {idx === 0 && (
                                                <Label className="text-base font-bold text-stone-900 font-alumni">
                                                    Size
                                                </Label>
                                            )}
                                            <Input
                                                value={variant.size}
                                                onChange={(e) =>
                                                    updateVariant(variant.id, "size", e.target.value)
                                                }
                                                placeholder="e.g. XL, L, 40"
                                                className={fieldStyle}
                                            />
                                        </Field>

                                        {/* Color */}
                                        <Field>
                                            {idx === 0 && (
                                                <Label className="text-base font-bold text-stone-900 font-alumni">
                                                    Colors
                                                </Label>
                                            )}
                                            <Input
                                                value={variant.color}
                                                onChange={(e) =>
                                                    updateVariant(variant.id, "color", e.target.value)
                                                }
                                                type="color"
                                                className={cn(fieldStyle, "px-2 py-1 cursor-pointer")}
                                            />
                                        </Field>

                                        {/* Stock Level */}
                                        <Field>
                                            {idx === 0 && (
                                                <Label className="text-base font-bold text-stone-900 font-alumni">
                                                    Stock Level
                                                </Label>
                                            )}
                                            <Input
                                                type="number"
                                                min="0"
                                                value={variant.quantity}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        variant.id,
                                                        "quantity",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="10"
                                                className={fieldStyle}
                                            />
                                        </Field>

                                        {/* Add More / Remove */}
                                        <div>
                                            {idx === variants.length - 1 ? (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={addVariant}
                                                    className="h-11 px-5 border border-stone-300 bg-transparent hover:bg-stone-100 text-stone-700 font-medium rounded-md gap-1.5 cursor-pointer"
                                                >
                                                    <Plus className="size-4" />
                                                    Add More
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeVariant(variant.id)}
                                                    className="h-11 w-11 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                                                >
                                                    <X className="size-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FieldSet>

                        {/* ════════════════════════════════════════════════
                            ROW 6 — Description
                        ════════════════════════════════════════════════ */}
                        <FieldSet>
                            <Field>
                                <Label className="text-base font-bold text-stone-900 font-alumni">
                                    Description
                                </Label>
                                <Textarea
                                    rows={6}
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    placeholder="Enter description"
                                    className={cn(fieldStyle, "h-auto resize-none py-3")}
                                />
                                <InputError message={errors.description} />
                            </Field>
                        </FieldSet>

                        {/* ── Submit ── */}
                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white px-10 h-11 rounded-md shadow-md transition-all font-medium cursor-pointer"
                            >
                                {processing
                                    ? "Saving..."
                                    : isEdit
                                        ? "Update Product"
                                        : "Upload"}
                            </Button>
                        </div>

                    </FieldGroup>
                </form>
            </div>
        </AdminLayout>
    );
}