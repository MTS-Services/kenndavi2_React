import { useMemo, useState } from "react";
import { useForm, router, Link } from "@inertiajs/react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { CalendarIcon, X, Plus } from "lucide-react";
import AdminLayout from "@/layouts/admin-layout";
import InputError from "@/components/input-error";
import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────── */
/* Constants                                                       */
/* ─────────────────────────────────────────────────────────────── */

const TOTAL_IMAGE_SLOTS = 5;   // slot 0 = primary, 1-4 = additional
const PRODUCT_TYPE = "men"; // hardcoded as instructed

/* ─────────────────────────────────────────────────────────────── */
/* ExistingFile — matches FileUpload component's prop interface    */
/* ─────────────────────────────────────────────────────────────── */

interface ExistingFile {
    id: number | string;
    path: string;
    url: string;
    mime_type: string;
    name?: string;
    size?: number;
}

/* ─────────────────────────────────────────────────────────────── */
/* ProductImage — mirrors the Laravel ProductImage model           */
/* ─────────────────────────────────────────────────────────────── */

interface ProductImage {
    id: number;
    url: string;
    alt_text?: string | null;
    is_primary: boolean;
    sort_order: number;
    color_id?: number | null;
}

/**
 * Adapter: converts a ProductImage (from the API) into the ExistingFile
 * shape that FileUpload expects.
 *
 * `path` is satisfied by `url` (same value — FileUpload uses it for display).
 * `mime_type` defaults to "image/jpeg" because all ProductImages are images;
 *  the server can include the real type if needed in the future.
 */
function toExistingFile(img: ProductImage): ExistingFile {
    return {
        id: img.id,
        url: img.url,
        path: img.url,               // FileUpload only uses url for <img src>
        mime_type: "image/jpeg",          // all ProductImage rows are images
        name: img.alt_text ?? undefined,
    };
}

/* ─────────────────────────────────────────────────────────────── */
/* Other types                                                     */
/* ─────────────────────────────────────────────────────────────── */

interface ProductVariant {
    id: number;
    color_id?: number | null;
    size_id?: number | null;
    color?: { id: number; name: string; hex: string } | null;
    size?: { id: number; name: string } | null;
    status?: string;
}

export interface Product {
    id: number;
    title: string;
    description: string | null;
    price: string;
    discount: string | null;
    discount_type: "percentage" | "fixed" | null;
    discount_starts_at: string | null;
    discount_ends_at: string | null;
    type: string;
    category_id: number | null;
    is_featured: boolean;
    status: string;
    images: ProductImage[];
    variants: ProductVariant[];
    // resolved by controller
    resolved_category_id: number | null;
    resolved_subcategory_id: number | null;
}

interface SubcategoryOption { id: number; title: string; }

export interface CategoryForSelect {
    id: number;
    title: string;
    children: SubcategoryOption[];
}

export interface EnumOption { value: string; label: string; }

interface PageProps {
    product?: Product;
    categories?: CategoryForSelect[];
    discountTypes?: EnumOption[];
}

/* ─────────────────────────────────────────────────────────────── */
/* Variant row (local UI state)                                    */
/* ─────────────────────────────────────────────────────────────── */

interface VariantRow {
    existingId?: number;
    size: string;
    color: string;
    quantity: string;
}

/* ─────────────────────────────────────────────────────────────── */
/* Inertia form shape                                              */
/* ─────────────────────────────────────────────────────────────── */

interface ProductFormData {
    _method: "PUT" | "";
    title: string;
    description: string;
    type: string;
    price: string;
    discount: string;
    discount_type: string;
    discount_starts_at: string;
    discount_ends_at: string;
    category_id: string;
    subcategory_id: string;
    primary_image: File | null;
    new_images: (File | null)[];
    removed_image_ids: number[];
    new_variants: { size: string; color: string; quantity: string }[];
    removed_variant_ids: number[];
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
    return <fieldset className={cn("border-0 p-0 m-0 min-w-0", className)}>{children}</fieldset>;
}

/* ─────────────────────────────────────────────────────────────── */
/* Shared field class                                              */
/* ─────────────────────────────────────────────────────────────── */

const field =
    "bg-[#1103040A] border-0 rounded-md focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-0 shadow-none h-11 text-stone-800 placeholder:text-stone-400";

/* ─────────────────────────────────────────────────────────────── */
/* DatePickerField                                                 */
/* ─────────────────────────────────────────────────────────────── */

interface DatePickerFieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
    placeholder?: string;
    minDate?: Date;
}

function DatePickerField({ label, value, onChange, disabled, placeholder, minDate }: DatePickerFieldProps) {
    const selected = value ? parseISO(value) : undefined;

    return (
        <Field>
            <Label
                className={cn(
                    "text-base font-bold font-alumni transition-colors duration-200",
                    disabled ? "text-stone-400" : "text-stone-900"
                )}
            >
                {label}
            </Label>
            <Popover>
                <PopoverTrigger asChild disabled={disabled}>
                    <button
                        type="button"
                        disabled={disabled}
                        className={cn(
                            field,
                            "flex items-center justify-between px-3 w-full rounded-md text-left transition-opacity duration-200",
                            disabled && "opacity-50 cursor-not-allowed",
                            !selected && "text-stone-400"
                        )}
                    >
                        <span className="text-sm">
                            {selected ? format(selected, "dd MMM yyyy") : (placeholder ?? "Pick a date")}
                        </span>
                        <CalendarIcon className="size-4 text-stone-500 shrink-0" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selected}
                        onSelect={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
                        disabled={minDate ? (d) => d < minDate : undefined}
                        captionLayout="dropdown"
                        initialFocus
                    />
                    {selected && (
                        <div className="border-t px-3 py-2">
                            <button
                                type="button"
                                onClick={() => onChange("")}
                                className="text-xs text-stone-500 hover:text-red-600 transition-colors"
                            >
                                Clear date
                            </button>
                        </div>
                    )}
                </PopoverContent>
            </Popover>
        </Field>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/* Helpers                                                         */
/* ─────────────────────────────────────────────────────────────── */

const toDateInput = (iso: string | null | undefined): string => {
    if (!iso) return "";
    try { return format(parseISO(iso), "yyyy-MM-dd"); }
    catch { return ""; }
};

/* ─────────────────────────────────────────────────────────────── */
/* Page Component                                                  */
/* ─────────────────────────────────────────────────────────────── */

export default function ProductForm({ product, categories = [], discountTypes = [] }: PageProps) {
    const isEdit = Boolean(product?.id);

    /* ── Resolve images → ExistingFile shape ── */
    const resolvedPrimaryFile: ExistingFile | null = useMemo(() => {
        const img = product?.images.find((i) => i.is_primary) ?? null;
        return img ? toExistingFile(img) : null;
    }, [product]);

    const resolvedAdditional: (ExistingFile | null)[] = useMemo(() => {
        const additional = (product?.images ?? []).filter((i) => !i.is_primary);
        return Array.from(
            { length: TOTAL_IMAGE_SLOTS - 1 },
            (_, idx) => (additional[idx] ? toExistingFile(additional[idx]) : null)
        );
    }, [product]);

    const [existingAdditional, setExistingAdditional] =
        useState<(ExistingFile | null)[]>(resolvedAdditional);

    /* ── Variant rows ── */
    const [variantRows, setVariantRows] = useState<VariantRow[]>(() => {
        if (isEdit && product?.variants?.length) {
            return product.variants.map((v) => ({
                existingId: v.id,
                size: v.size?.name ?? "",
                color: v.color?.hex ? `#${v.color.hex.replace("#", "")}` : "#000000",
                quantity: "",
            }));
        }
        return [{ size: "", color: "#000000", quantity: "" }];
    });

    const addVariantRow = () =>
        setVariantRows((p) => [...p, { size: "", color: "#000000", quantity: "" }]);

    const removeVariantRow = (idx: number) => {
        const row = variantRows[idx];
        if (row.existingId) {
            setData("removed_variant_ids", [...data.removed_variant_ids, row.existingId]);
        }
        setVariantRows((p) => p.filter((_, i) => i !== idx));
    };

    const updateVariantRow = (
        idx: number,
        key: keyof Omit<VariantRow, "existingId">,
        value: string
    ) => setVariantRows((p) => p.map((r, i) => (i === idx ? { ...r, [key]: value } : r)));

    /* ── Inertia form ── */
    const { data, setData, post, processing, errors } = useForm<ProductFormData>({
        _method: isEdit ? "PUT" : "",
        title: product?.title ?? "",
        description: product?.description ?? "",
        type: PRODUCT_TYPE,
        price: product?.price ?? "",
        discount: product?.discount ?? "",
        discount_type: product?.discount_type ?? "",
        discount_starts_at: toDateInput(product?.discount_starts_at),
        discount_ends_at: toDateInput(product?.discount_ends_at),
        category_id: product?.resolved_category_id != null
            ? String(product.resolved_category_id) : "",
        subcategory_id: product?.resolved_subcategory_id != null
            ? String(product.resolved_subcategory_id) : "",
        primary_image: null,
        new_images: Array(TOTAL_IMAGE_SLOTS - 1).fill(null),
        removed_image_ids: [],
        new_variants: [],
        removed_variant_ids: [],
    });

    /* ── Derived: filtered subcategories ── */
    const filteredSubcategories = useMemo<SubcategoryOption[]>(() => {
        if (!data.category_id) return [];
        return categories.find((c) => String(c.id) === data.category_id)?.children ?? [];
    }, [data.category_id, categories]);

    const subcategoryDisabled = !data.category_id || filteredSubcategories.length === 0;
    const discountFieldsDisabled = !data.discount_type;

    /* ── Handlers ── */
    const handleCategoryChange = (v: string) => {
        setData("category_id", v);
        setData("subcategory_id", "");
    };

    const handleDiscountTypeChange = (v: string) => {
        setData("discount_type", v);
        setData("discount", "");
        setData("discount_starts_at", "");
        setData("discount_ends_at", "");
    };

    const setImageSlot = (i: number, file: File | null) => {
        const updated = [...data.new_images];
        updated[i] = file;
        setData("new_images", updated);
    };

    const handleRemoveExistingImage = (slotIdx: number, id: number | string) => {
        const updated = [...existingAdditional];
        updated[slotIdx] = null;
        setExistingAdditional(updated);
        setData("removed_image_ids", [...data.removed_image_ids, Number(id)]);
    };

    /* ── Submit ── */
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Flush new variant rows into form data right before submitting
        const newVariants = variantRows
            .filter((r) => !r.existingId)
            .map(({ size, color, quantity }) => ({ size, color, quantity }));

        setData("new_variants", newVariants);

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
        data.discount_type === "percentage" ? "e.g. 10"
            : data.discount_type === "fixed" ? "e.g. 5.00"
                : "Set type first";

    /* ── Render ── */
    return (
        <AdminLayout
            title={isEdit ? "Edit Product" : "Add New Product"}
            description={isEdit ? "Update the product details below." : "Fill in the details to add a new product."}
        >
            <div className="bg-[#FDF7F7] w-full p-8 rounded-lg shadow-lg">

                {/* Header */}
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

                        {/* ══════════════════════════════════════════════
                            ROW 1 — Images
                        ══════════════════════════════════════════════ */}
                        <FieldSet>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

                                {/* Primary image slot */}
                                <Field>
                                    <FileUpload
                                        value={data.primary_image}
                                        onChange={(file) =>
                                            setData("primary_image", file as File | null)
                                        }
                                        existingFiles={
                                            isEdit && resolvedPrimaryFile
                                                ? [resolvedPrimaryFile]
                                                : []
                                        }
                                        accept="image/*"
                                        maxSize={10}
                                        maxFiles={1}
                                        error={errors.primary_image}
                                        innerClassName="aspect-7/5 flex items-center justify-center bg-[#1103040A] rounded-md"
                                    />
                                </Field>

                                {/* Additional image slots 1-4 */}
                                {Array.from({ length: TOTAL_IMAGE_SLOTS - 1 }, (_, i) => {
                                    const existing = existingAdditional[i]; // already ExistingFile | null
                                    return (
                                        <Field key={i}>
                                            <FileUpload
                                                value={data.new_images[i]}
                                                onChange={(file) =>
                                                    setImageSlot(i, file as File | null)
                                                }
                                                existingFiles={existing ? [existing] : []}
                                                onRemoveExisting={(id) =>
                                                    handleRemoveExistingImage(i, id)
                                                }
                                                accept="image/*"
                                                maxSize={10}
                                                maxFiles={1}
                                                error={
                                                    (errors as Record<string, string>)[
                                                    `new_images.${i}`
                                                    ]
                                                }
                                                innerClassName="aspect-7/5 flex items-center justify-center bg-[#1103040A] rounded-md"
                                            />
                                        </Field>
                                    );
                                })}
                            </div>
                        </FieldSet>

                        {/* ══════════════════════════════════════════════
                            ROW 2 — Title
                        ══════════════════════════════════════════════ */}
                        <FieldSet>
                            <Field>
                                <Label className="text-base font-bold text-stone-900 font-alumni">
                                    Title
                                </Label>
                                <Input
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    placeholder="Enter product title"
                                    className={field}
                                    required
                                />
                                <InputError message={errors.title} />
                            </Field>
                        </FieldSet>

                        {/* ══════════════════════════════════════════════
                            ROW 3 — Category + Subcategory
                        ══════════════════════════════════════════════ */}
                        <FieldSet>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <Field>
                                    <Label className="text-base font-bold text-stone-900 font-alumni">
                                        Category
                                    </Label>
                                    <Select
                                        value={data.category_id}
                                        onValueChange={handleCategoryChange}
                                    >
                                        <SelectTrigger className={cn(field, "w-full")}>
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

                                <Field>
                                    <Label
                                        className={cn(
                                            "text-base font-bold font-alumni transition-colors duration-200",
                                            subcategoryDisabled ? "text-stone-400" : "text-stone-900"
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
                                                field, "w-full transition-opacity duration-200",
                                                subcategoryDisabled && "opacity-50 cursor-not-allowed"
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

                        {/* ══════════════════════════════════════════════
                            ROW 4 — Price · Discount Type · Discount Value
                        ══════════════════════════════════════════════ */}
                        <FieldSet>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

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
                                        className={field}
                                        required
                                    />
                                    <InputError message={errors.price} />
                                </Field>

                                <Field>
                                    <Label className="text-base font-bold text-stone-900 font-alumni">
                                        Discount Type
                                    </Label>
                                    <Select
                                        value={data.discount_type}
                                        onValueChange={handleDiscountTypeChange}
                                    >
                                        <SelectTrigger className={cn(field, "w-full")}>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {discountTypes.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field>
                                    <Label
                                        className={cn(
                                            "text-base font-bold font-alumni transition-colors duration-200",
                                            discountFieldsDisabled ? "text-stone-400" : "text-stone-900"
                                        )}
                                    >
                                        Discount Value
                                        {data.discount_type === "percentage" && (
                                            <span className="ml-1 text-sm font-normal text-stone-500">(%)</span>
                                        )}
                                        {data.discount_type === "fixed" && (
                                            <span className="ml-1 text-sm font-normal text-stone-500">(amount)</span>
                                        )}
                                    </Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        step={data.discount_type === "percentage" ? "1" : "0.01"}
                                        max={data.discount_type === "percentage" ? "100" : undefined}
                                        value={data.discount}
                                        onChange={(e) => setData("discount", e.target.value)}
                                        placeholder={discountPlaceholder}
                                        disabled={discountFieldsDisabled}
                                        className={cn(
                                            field, "transition-opacity duration-200",
                                            discountFieldsDisabled && "opacity-50 cursor-not-allowed"
                                        )}
                                    />
                                    <InputError message={errors.discount} />
                                </Field>

                            </div>
                        </FieldSet>

                        {/* ══════════════════════════════════════════════
                            ROW 4b — Offer Start / End Date
                            (disabled until a discount type is selected)
                        ══════════════════════════════════════════════ */}
                        <FieldSet>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DatePickerField
                                    label="Offer Start Date"
                                    value={data.discount_starts_at}
                                    onChange={(v) => setData("discount_starts_at", v)}
                                    disabled={discountFieldsDisabled}
                                    placeholder="Select start date"
                                />
                                <DatePickerField
                                    label="Offer End Date"
                                    value={data.discount_ends_at}
                                    onChange={(v) => setData("discount_ends_at", v)}
                                    disabled={discountFieldsDisabled}
                                    placeholder="Select end date"
                                    minDate={
                                        data.discount_starts_at
                                            ? parseISO(data.discount_starts_at)
                                            : undefined
                                    }
                                />
                            </div>
                        </FieldSet>

                        {/* ══════════════════════════════════════════════
                            ROW 5 — Variants (Size · Color · Stock)
                        ══════════════════════════════════════════════ */}
                        <FieldSet>
                            <div className="flex flex-col gap-3">
                                {variantRows.map((row, idx) => (
                                    <div
                                        key={idx}
                                        className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end"
                                    >
                                        <Field>
                                            {idx === 0 && (
                                                <Label className="text-base font-bold text-stone-900 font-alumni">
                                                    Size
                                                </Label>
                                            )}
                                            <Input
                                                value={row.size}
                                                onChange={(e) =>
                                                    updateVariantRow(idx, "size", e.target.value)
                                                }
                                                placeholder="e.g. XL, L, 40"
                                                className={field}
                                            />
                                        </Field>

                                        <Field>
                                            {idx === 0 && (
                                                <Label className="text-base font-bold text-stone-900 font-alumni">
                                                    Color
                                                </Label>
                                            )}
                                            <Input
                                                type="color"
                                                value={row.color}
                                                onChange={(e) =>
                                                    updateVariantRow(idx, "color", e.target.value)
                                                }
                                                className={cn(field, "px-2 py-1 cursor-pointer")}
                                            />
                                        </Field>

                                        <Field>
                                            {idx === 0 && (
                                                <Label className="text-base font-bold text-stone-900 font-alumni">
                                                    Stock Level
                                                </Label>
                                            )}
                                            <Input
                                                type="number"
                                                min="0"
                                                value={row.quantity}
                                                onChange={(e) =>
                                                    updateVariantRow(idx, "quantity", e.target.value)
                                                }
                                                placeholder="10"
                                                className={field}
                                            />
                                        </Field>

                                        <div>
                                            {idx === variantRows.length - 1 ? (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={addVariantRow}
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
                                                    onClick={() => removeVariantRow(idx)}
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

                        {/* ══════════════════════════════════════════════
                            ROW 6 — Description
                        ══════════════════════════════════════════════ */}
                        <FieldSet>
                            <Field>
                                <Label className="text-base font-bold text-stone-900 font-alumni">
                                    Description
                                </Label>
                                <Textarea
                                    rows={6}
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    placeholder="Enter product description"
                                    className={cn(field, "h-auto resize-none py-3")}
                                />
                                <InputError message={errors.description} />
                            </Field>
                        </FieldSet>

                        {/* Submit */}
                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white px-10 h-11 rounded-md shadow-md transition-all font-medium cursor-pointer"
                            >
                                {processing ? "Saving…" : isEdit ? "Update Product" : "Upload"}
                            </Button>
                        </div>

                    </FieldGroup>
                </form>
            </div>
        </AdminLayout>
    );
}