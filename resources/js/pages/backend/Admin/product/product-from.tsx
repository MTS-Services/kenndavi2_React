import { useMemo, useRef, useState } from "react";
import { useForm, router, Link } from "@inertiajs/react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import AdminLayout from "@/layouts/admin-layout";
import InputError from "@/components/input-error";
import FileUpload from "@/components/file-upload";
import VariantMatrix, { VariantMatrixRef } from "@/components/variant-matrix";
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

const TOTAL_IMAGE_SLOTS = 5;

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
/* ProductImage — mirrors Laravel ProductImage model               */
/* ─────────────────────────────────────────────────────────────── */

interface ProductImage {
    id: number;
    url: string;
    alt_text?: string | null;
    is_primary: boolean;
    sort_order: number;
    color_id?: number | null;
}

function toExistingFile(img: ProductImage): ExistingFile {
    return {
        id: img.id,
        url: img.url,
        path: img.url,
        mime_type: "image/jpeg",
        name: img.alt_text ?? undefined,
    };
}

/* ─────────────────────────────────────────────────────────────── */
/* Domain types                                                    */
/* ─────────────────────────────────────────────────────────────── */

export interface ProductVariant {
    id: number;
    color_id?: number | null;
    size_id?: number | null;
    color?: { id: number; name: string; hex: string } | null;
    size?: { id: number; name: string } | null;
    quantity?: number;
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
    initialType?: string;
    categories?: CategoryForSelect[];
    discountTypes?: EnumOption[];
    productTypes?: EnumOption[];
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
    /** Flattened from the matrix on submit */
    variants: { size: string; color: string; quantity: number; existingId?: number }[];
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
            <Label className={cn(
                "text-base font-bold font-alumni transition-colors duration-200",
                disabled ? "text-stone-400" : "text-stone-900"
            )}>
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
                        onSelect={(d) => onChange(d ? format(d, "yyyy-MM-dd") : "")}
                        disabled={minDate ? (d) => d < minDate : undefined}
                        captionLayout="dropdown"
                        initialFocus
                    />
                    {selected && (
                        <div className="border-t px-3 py-2">
                            <button type="button" onClick={() => onChange("")}
                                className="text-xs text-stone-500 hover:text-red-600 transition-colors">
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
    try { return format(parseISO(iso), "yyyy-MM-dd"); } catch { return ""; }
};

/* ─────────────────────────────────────────────────────────────── */
/* Page Component                                                  */
/* ─────────────────────────────────────────────────────────────── */

export default function ProductForm({
    product,
    initialType = "men",
    categories = [],
    discountTypes = [],
    productTypes = [],
}: PageProps) {
    const isEdit = Boolean(product?.id);
    const resolvedType = isEdit ? (product?.type ?? initialType) : initialType;

    /* ── ref to read variant matrix on submit ── */
    const variantMatrixRef = useRef<VariantMatrixRef>(null);

    /* ── Resolve images ── */
    const resolvedPrimaryFile = useMemo<ExistingFile | null>(() => {
        const img = product?.images.find((i) => i.is_primary) ?? null;
        return img ? toExistingFile(img) : null;
    }, [product]);

    const resolvedAdditional = useMemo<(ExistingFile | null)[]>(() => {
        const additional = (product?.images ?? []).filter((i) => !i.is_primary);
        return Array.from(
            { length: TOTAL_IMAGE_SLOTS - 1 },
            (_, idx) => (additional[idx] ? toExistingFile(additional[idx]) : null)
        );
    }, [product]);

    const [existingAdditional, setExistingAdditional] =
        useState<(ExistingFile | null)[]>(resolvedAdditional);

    /* ── Inertia form ── */
    const { data, setData, post, processing, errors } = useForm<ProductFormData>({
        _method: isEdit ? "PUT" : "",
        title: product?.title ?? "",
        description: product?.description ?? "",
        type: resolvedType,
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
        variants: [],
        removed_variant_ids: [],
    });

    /* ── Derived ── */
    const filteredSubcategories = useMemo<SubcategoryOption[]>(() => {
        if (!data.category_id) return [];
        return categories.find((c) => String(c.id) === data.category_id)?.children ?? [];
    }, [data.category_id, categories]);

    const subcategoryDisabled = !data.category_id || filteredSubcategories.length === 0;
    const discountFieldsDisabled = !data.discount_type;

    const typeLabel = productTypes.find((t) => t.value === resolvedType)?.label ?? resolvedType;

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

    /* ── Submit: read matrix right before posting ── */
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const matrix = variantMatrixRef.current;
        const variants = matrix?.getVariants() ?? [];
        const removedVariants = matrix?.getRemovedIds() ?? [];

        // Write into form data synchronously then post
        data.variants = variants;
        data.removed_variant_ids = removedVariants;

        post(
            isEdit
                ? route("admin.products.update", product!.id)
                : route("admin.products.store"),
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () =>
                    router.visit(route("admin.products.index", { type: data.type })),
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

    return (
        <AdminLayout
            title={isEdit ? `Edit ${typeLabel} Product` : `Add New ${typeLabel} Product`}
            description={
                isEdit
                    ? "Update the product details below."
                    : `Fill in the details to add a new ${typeLabel.toLowerCase()} product.`
            }
        >
            <div className="bg-[#FDF7F7] w-full p-8 rounded-lg shadow-lg">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-stone-900 font-alumni">
                            {isEdit ? "Edit Product" : "Add new Product"}
                        </h2>
                        <span className="text-xs font-medium text-stone-500 mt-0.5 block capitalize">
                            Type: <span className="text-red-700 font-semibold">{typeLabel}</span>
                        </span>
                    </div>
                    <Link
                        href={route("admin.products.index", { type: resolvedType })}
                        className="bg-red-700 hover:bg-red-800 text-white p-1.5 rounded transition-colors cursor-pointer"
                    >
                        <X className="size-4" />
                    </Link>
                </div>

                <form onSubmit={submit}>
                    <FieldGroup>

                        {/* ══ ROW 1 — Images ══════════════════════════ */}
                        <FieldSet>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <Field>
                                    <FileUpload
                                        value={data.primary_image}
                                        onChange={(file) => setData("primary_image", file as File | null)}
                                        existingFiles={isEdit && resolvedPrimaryFile ? [resolvedPrimaryFile] : []}
                                        accept="image/*" maxSize={10} maxFiles={1}
                                        error={errors.primary_image}
                                        innerClassName="aspect-7/5 flex items-center justify-center bg-[#1103040A] rounded-md"
                                    />
                                </Field>
                                {Array.from({ length: TOTAL_IMAGE_SLOTS - 1 }, (_, i) => {
                                    const existing = existingAdditional[i];
                                    return (
                                        <Field key={i}>
                                            <FileUpload
                                                value={data.new_images[i]}
                                                onChange={(file) => setImageSlot(i, file as File | null)}
                                                existingFiles={existing ? [existing] : []}
                                                onRemoveExisting={(id) => handleRemoveExistingImage(i, id)}
                                                accept="image/*" maxSize={10} maxFiles={1}
                                                error={(errors as Record<string, string>)[`new_images.${i}`]}
                                                innerClassName="aspect-7/5 flex items-center justify-center bg-[#1103040A] rounded-md"
                                            />
                                        </Field>
                                    );
                                })}
                            </div>
                        </FieldSet>

                        {/* ══ ROW 2 — Title ═══════════════════════════ */}
                        <FieldSet>
                            <Field>
                                <Label className="text-base font-bold text-stone-900 font-alumni">Title</Label>
                                <Input
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    placeholder="Enter product title"
                                    className={field} required
                                />
                                <InputError message={errors.title} />
                            </Field>
                        </FieldSet>

                        {/* ══ ROW 3 — Category + Subcategory ══════════ */}
                        <FieldSet>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field>
                                    <Label className="text-base font-bold text-stone-900 font-alumni">Category</Label>
                                    <Select value={data.category_id} onValueChange={handleCategoryChange}>
                                        <SelectTrigger className={cn(field, "w-full")}>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category_id} />
                                </Field>

                                <Field>
                                    <Label className={cn(
                                        "text-base font-bold font-alumni transition-colors duration-200",
                                        subcategoryDisabled ? "text-stone-400" : "text-stone-900"
                                    )}>
                                        Subcategory
                                    </Label>
                                    <Select
                                        value={data.subcategory_id}
                                        onValueChange={(v) => setData("subcategory_id", v)}
                                        disabled={subcategoryDisabled}
                                    >
                                        <SelectTrigger className={cn(
                                            field, "w-full transition-opacity duration-200",
                                            subcategoryDisabled && "opacity-50 cursor-not-allowed"
                                        )}>
                                            <SelectValue placeholder={
                                                !data.category_id ? "Select a category first"
                                                    : filteredSubcategories.length === 0 ? "No subcategories available"
                                                        : "Select subcategory"
                                            } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredSubcategories.map((s) => (
                                                <SelectItem key={s.id} value={String(s.id)}>{s.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>
                        </FieldSet>

                        {/* ══ ROW 4 — Price · Discount Type · Discount Value ═══ */}
                        <FieldSet>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Field>
                                    <Label className="text-base font-bold text-stone-900 font-alumni">Price</Label>
                                    <Input
                                        type="number" min="0" step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData("price", e.target.value)}
                                        placeholder="0.00" className={field} required
                                    />
                                    <InputError message={errors.price} />
                                </Field>

                                <Field>
                                    <Label className="text-base font-bold text-stone-900 font-alumni">Discount Type</Label>
                                    <Select value={data.discount_type} onValueChange={handleDiscountTypeChange}>
                                        <SelectTrigger className={cn(field, "w-full")}>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {discountTypes.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field>
                                    <Label className={cn(
                                        "text-base font-bold font-alumni transition-colors duration-200",
                                        discountFieldsDisabled ? "text-stone-400" : "text-stone-900"
                                    )}>
                                        Discount Value
                                        {data.discount_type === "percentage" && <span className="ml-1 text-sm font-normal text-stone-500">(%)</span>}
                                        {data.discount_type === "fixed" && <span className="ml-1 text-sm font-normal text-stone-500">(amount)</span>}
                                    </Label>
                                    <Input
                                        type="number" min="0"
                                        step={data.discount_type === "percentage" ? "1" : "0.01"}
                                        max={data.discount_type === "percentage" ? "100" : undefined}
                                        value={data.discount}
                                        onChange={(e) => setData("discount", e.target.value)}
                                        placeholder={discountPlaceholder}
                                        disabled={discountFieldsDisabled}
                                        className={cn(field, "transition-opacity duration-200", discountFieldsDisabled && "opacity-50 cursor-not-allowed")}
                                    />
                                    <InputError message={errors.discount} />
                                </Field>
                            </div>
                        </FieldSet>

                        {/* ══ ROW 4b — Offer Start / End Date ═════════ */}
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
                                    minDate={data.discount_starts_at ? parseISO(data.discount_starts_at) : undefined}
                                />
                            </div>
                        </FieldSet>

                        {/* ══ ROW 5 — Variant Matrix ═══════════════════
                            Uses forwardRef + useImperativeHandle so we
                            can read sizes/colors/quantities on submit
                            without lifting state up into the form.
                        ════════════════════════════════════════════════ */}
                        <FieldSet>
                            <Label className="text-base font-bold text-stone-900 font-alumni mb-1 block">
                                Variants
                            </Label>
                            <p className="text-xs text-stone-400 mb-3">
                                Add all available sizes and colors — the grid auto-generates.
                                Enter stock quantities per cell. Use "Fill all" shortcuts to
                                set the same quantity across an entire row or column at once.
                            </p>
                            <VariantMatrix
                                ref={variantMatrixRef}
                                existingVariants={product?.variants}
                            />
                        </FieldSet>

                        {/* ══ ROW 6 — Description ══════════════════════ */}
                        <FieldSet>
                            <Field>
                                <Label className="text-base font-bold text-stone-900 font-alumni">Description</Label>
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