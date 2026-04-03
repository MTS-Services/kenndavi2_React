import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AdminLayout from "@/layouts/admin-layout";
import InputError from "@/components/input-error";
import { Check, ChevronsUpDown, PencilLine, Trash, X } from "lucide-react";
import { useState, useEffect, ReactNode, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useForm, router } from "@inertiajs/react";
import { toast } from "sonner";

/* ─────────────────────────────────────────────────────────────── */
/* Types                                                           */
/* ─────────────────────────────────────────────────────────────── */

export interface CategoryChild {
    id: number;
    title: string;
    slug: string;
    parent_ids: number[];
    types: string[];
}

export interface CategoryShape {
    id: number;
    title: string;
    slug: string;
    status?: string;
    types: string[];
    children: CategoryChild[];
}

export interface CategoryForSelect {
    id: number;
    title: string;
    types: string[];
}

export interface EnumOption {
    value: string;
    label: string;
}

interface PageProps {
    categories: CategoryShape[];
    categoriesForSelect: CategoryForSelect[];
    activeType: string;
    productTypes: EnumOption[];
    success?: string;
}

// Only the flash fields — avoids TS2352 when casting Inertia's
// internal page props (which include errors, deferred, etc.)
interface FlashProps {
    success?: string;
}

/* ─────────────────────────────────────────────────────────────── */
/* Partial reload props — plain string[] avoids TS2345            */
/* ─────────────────────────────────────────────────────────────── */

const ONLY_PROPS: string[] = ["categories", "categoriesForSelect", "activeType", "productTypes", "success"];

/* ─────────────────────────────────────────────────────────────── */
/* Helpers                                                         */
/* ─────────────────────────────────────────────────────────────── */

function destroyUrl(id: number, parentId?: number): string {
    const base = route("admin.categories.destroy", id);
    return parentId != null ? `${base}?parent_id=${parentId}` : base;
}

/* ─────────────────────────────────────────────────────────────── */
/* MultiSelect                                                     */
/* ─────────────────────────────────────────────────────────────── */

interface MultiSelectProps {
    options: CategoryForSelect[];
    selected: CategoryForSelect[];
    onChange: (selected: CategoryForSelect[]) => void;
    placeholder?: string;
}

function MultiSelect({ options, selected, onChange, placeholder = "Select options..." }: MultiSelectProps) {
    const [open, setOpen] = useState(false);

    const toggle = (item: CategoryForSelect) => {
        const already = selected.some((s) => s.id === item.id);
        onChange(already ? selected.filter((s) => s.id !== item.id) : [...selected, item]);
    };

    const remove = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(selected.filter((s) => s.id !== id));
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded border border-input",
                        "bg-[#1103040A] px-3 py-2 text-sm shadow-sm transition-colors",
                        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-[#1103040A]/80"
                    )}
                >
                    <div className="flex-1 flex flex-wrap items-center gap-1.5">
                        {selected.length === 0 ? (
                            <span className="text-muted-foreground">{placeholder}</span>
                        ) : (
                            selected.map((item) => (
                                <Badge key={item.id} variant="secondary" className="flex items-center gap-1 pr-1 bg-[#ffccd1A0]">
                                    {item.title}
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        onClick={(e) => remove(item.id, e)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                onChange(selected.filter((s) => s.id !== item.id));
                                            }
                                        }}
                                        className="ml-0.5 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                                    >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </span>
                                </Badge>
                            ))
                        )}
                    </div>
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search categories..." />
                    <CommandList>
                        <CommandEmpty>No categories found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((item) => {
                                const isSelected = selected.some((s) => s.id === item.id);
                                return (
                                    <CommandItem
                                        key={item.id}
                                        value={item.title}
                                        onSelect={() => toggle(item)}
                                        className="cursor-pointer text-[#110304B8]"
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                                        {item.title}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/* IconButton — plain button, no forwardRef needed                */
/* We never use this inside DialogTrigger asChild anymore.        */
/* ─────────────────────────────────────────────────────────────── */

function IconButton({ icon, onClick }: { icon: ReactNode; onClick?: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="rounded-md p-2 bg-[#FDF7F7] flex items-center justify-center cursor-pointer"
        >
            {icon}
        </button>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/* Page                                                            */
/* ─────────────────────────────────────────────────────────────── */

export default function CategoryIndex({
    categories,
    categoriesForSelect,
    activeType,
    productTypes,
}: PageProps) {
    useEffect(() => {
        return router.on("success", (event) => {
            const { success } = event.detail.page.props as unknown as FlashProps;
            if (success) toast.success(success);
        });
    }, []);

    return (
        <AdminLayout title="Category Management" description="Manage your categories effectively.">
            <section className="p-4 md:p-10 font-sans rounded-lg shadow-sm border border-destructive">
                <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                    <h3 className="text-2xl font-semibold font-alumni text-text-primary">
                        Categories
                    </h3>
                    <div className="flex items-center gap-2 bg-[#1103040A] p-2 rounded-md">
                        {productTypes.map((t) => {
                            const isActive = t.value === activeType;
                            return (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => router.get(route("admin.categories.index"), { type: t.value }, { preserveScroll: true })}
                                    className={cn(
                                        "px-4 py-2 rounded-md text-sm font-medium transition-colors border",
                                        isActive
                                            ? "bg-red-700 text-white border-red-700"
                                            : "bg-[#FDF7F7] text-stone-700 border-stone-200 hover:bg-stone-100"
                                    )}
                                >
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex items-center justify-end gap-7">
                        {/* Add modals are standalone — no trigger prop needed */}
                        <CategoryFormModal activeType={activeType} productTypes={productTypes} />
                        <SubcategoryFormModal
                            categoriesForSelect={categoriesForSelect}
                            activeType={activeType}
                            productTypes={productTypes}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-5">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            categoriesForSelect={categoriesForSelect}
                            activeType={activeType}
                            productTypes={productTypes}
                        />
                    ))}
                </div>
            </section>
        </AdminLayout>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/* CategoryCard                                                    */
/* ─────────────────────────────────────────────────────────────── */

function CategoryCard({
    category,
    categoriesForSelect,
    activeType,
    productTypes,
}: {
    category: CategoryShape;
    categoriesForSelect: CategoryForSelect[];
    activeType: string;
    productTypes: EnumOption[];
}) {
    return (
        <div className="bg-[#1103040A] p-4 rounded-lg border border-border-primary">
            <div className="flex items-center justify-between gap-4">
                <h2 className="font-alumni text-2xl font-semibold">{category.title}</h2>
                <div className="flex items-center gap-2">
                    {/* Edit / delete for the parent category */}
                    <CategoryFormModal category={category} activeType={activeType} productTypes={productTypes} />
                    <DeleteDialog
                        id={category.id}
                        label={`Delete category "${category.title}"?`}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4 pl-2 mt-4">
                {category.children.map((subcategory) => (
                    <div key={subcategory.id} className="flex items-center justify-between gap-4">
                        <h3 className="font-libre">{subcategory.title}</h3>
                        <div className="flex items-center gap-2">
                            {/* Edit / delete for each subcategory */}
                            <SubcategoryFormModal
                                subcategory={subcategory}
                                categoriesForSelect={categoriesForSelect}
                                activeType={activeType}
                                productTypes={productTypes}
                            />
                            <DeleteDialog
                                id={subcategory.id}
                                parentId={category.id}
                                label={`Remove "${subcategory.title}" from this category? It will stay under other parents. Remove from all to delete it.`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/* DeleteDialog                                                    */
/* ─────────────────────────────────────────────────────────────── */

function DeleteDialog({
    id,
    parentId,
    label,
}: {
    id: number;
    parentId?: number;
    label: string;
}) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(destroyUrl(id, parentId), {
            preserveScroll: true,
            only: ONLY_PROPS,
            onSuccess: () => setOpen(false),
            onError: () => toast.error("Failed to delete. Please try again."),
        });
    };

    return (
        <>
            {/* Plain onClick — no DialogTrigger / asChild / Slot involved */}
            <IconButton icon={<Trash className="size-4" />} onClick={() => setOpen(true)} />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md bg-[#FDF7F7]">
                    <DialogHeader>
                        <DialogTitle className="font-alumni">{label}</DialogTitle>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" className="font-normal cursor-pointer">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            className="font-normal cursor-pointer"
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

/* ─────────────────────────────────────────────────────────────── */
/* CategoryFormModal                                               */
/*                                                                 */
/* When `category` is provided  → Edit mode.                      */
/* When omitted                 → Add mode (renders an Add button) */
/* ─────────────────────────────────────────────────────────────── */

interface CategoryFormData {
    title: string;
    slug: string;
    types: string[];
}

function CategoryFormModal({
    category,
    activeType,
    productTypes,
}: {
    category?: CategoryShape;
    activeType: string;
    productTypes: EnumOption[];
}) {
    const [open, setOpen] = useState(false);
    const isEdit = Boolean(category?.id);

    const { data, setData, post, put, processing, errors, clearErrors, reset } =
        useForm<CategoryFormData>({ title: "", slug: "", types: [activeType] });

    const handleOpen = () => {
        // Pre-fill with existing values when editing
        setData({
            title: category?.title ?? "",
            slug: category?.slug ?? "",
            types: category?.types?.length ? category.types : [activeType],
        });
        clearErrors();
        setOpen(true);
    };

    const handleClose = () => {
        reset();
        setOpen(false);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            only: ONLY_PROPS,
            onSuccess: () => handleClose(),
            onError: (errs: Record<string, string>) => {
                const first = Object.values(errs)[0];
                if (first) toast.error(first);
            },
        };

        isEdit
            ? put(route("admin.categories.update", category!.id), options)
            : post(route("admin.categories.store"), options);
    };

    return (
        <>
            {/*
             * Trigger rendered outside Dialog — no asChild / Slot / forwardRef.
             * A plain onClick is all that's needed to control the dialog.
             */}
            {isEdit ? (
                <IconButton icon={<PencilLine className="size-4" />} onClick={handleOpen} />
            ) : (
                <Button className="font-normal cursor-pointer" onClick={handleOpen}>
                    Add Category
                </Button>
            )}

            <Dialog open={open} onOpenChange={(next) => { if (!next) handleClose(); }}>
                <DialogContent className="max-w-2xl bg-[#FDF7F7]">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-semibold font-alumni">
                            {isEdit ? "Edit Category" : "Add Category"}
                        </DialogTitle>
                        <DialogDescription
                            className="text-sm text-muted-foreground"
                        >
                            {isEdit ? "Edit the category." : "Add a new category."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="flex flex-col gap-5 py-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-lg font-medium font-alumni">
                                Types
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {productTypes.map((t) => {
                                    const selected = data.types.includes(t.value);
                                    return (
                                        <button
                                            key={t.value}
                                            type="button"
                                            onClick={() => {
                                                setData(
                                                    "types",
                                                selected
                                                    ? (data.types.length === 1
                                                        ? data.types
                                                        : data.types.filter((x) => x !== t.value))
                                                        : [...data.types, t.value]
                                                );
                                            }}
                                            className={cn(
                                                "px-3 py-2 rounded-md text-sm border transition-colors",
                                                selected
                                                    ? "bg-red-700 text-white border-red-700"
                                                    : "bg-[#1103040A] text-stone-700 border-stone-200 hover:bg-stone-100"
                                            )}
                                        >
                                            {t.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.types as unknown as string} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="cat-title" className="text-lg font-medium font-alumni">
                                Category Name
                            </Label>
                            <Input
                                id="cat-title"
                                value={data.title}
                                onChange={(e) => setData("title", e.target.value)}
                                placeholder="Enter category name"
                                className="bg-[#1103040A] rounded"
                                required
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="cat-slug" className="text-lg font-medium font-alumni">
                                Slug
                            </Label>
                            <Input
                                id="cat-slug"
                                value={data.slug}
                                onChange={(e) => setData("slug", e.target.value)}
                                placeholder="category-slug-example"
                                className="bg-[#1103040A] rounded"
                                required
                            />
                            <InputError message={errors.slug} />
                        </div>

                        <DialogFooter className="sm:justify-start">
                            <Button
                                type="submit"
                                className="font-normal cursor-pointer"
                                disabled={processing}
                            >
                                {processing ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/* SubcategoryFormModal                                            */
/*                                                                 */
/* When `subcategory` is provided → Edit mode.                    */
/* When omitted                   → Add mode (renders Add button) */
/* ─────────────────────────────────────────────────────────────── */

interface SubcategoryFormData {
    title: string;
    slug: string;
    category_ids: number[];
    types: string[];
}

function SubcategoryFormModal({
    subcategory,
    categoriesForSelect,
    activeType,
    productTypes,
}: {
    subcategory?: CategoryChild;
    categoriesForSelect: CategoryForSelect[];
    activeType: string;
    productTypes: EnumOption[];
}) {
    const [open, setOpen] = useState(false);
    const isEdit = Boolean(subcategory?.id);

    const { data, setData, post, put, processing, errors, clearErrors, reset } =
        useForm<SubcategoryFormData>({ title: "", slug: "", category_ids: [], types: [activeType] });

    // Derived from form state — single source of truth, never drifts.
    const selectedCategories = categoriesForSelect.filter((c) =>
        data.category_ids.includes(c.id)
    );

    const allowedTypeValues = useMemo<string[]>(() => {
        const selected = categoriesForSelect.filter((c) => data.category_ids.includes(c.id));
        const set = new Set<string>();
        selected.forEach((c) => (c.types ?? []).forEach((t) => set.add(t)));
        return Array.from(set);
    }, [categoriesForSelect, data.category_ids]);

    const typeSelectionDisabled = data.category_ids.length === 0;

    useEffect(() => {
        if (typeSelectionDisabled) {
            setData("types", []);
            return;
        }

        const nextTypes = data.types.filter((t: string) => allowedTypeValues.includes(t));
        setData("types", nextTypes.length > 0 ? nextTypes : [allowedTypeValues[0] ?? activeType]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeSelectionDisabled, allowedTypeValues.join("|"), data.types.join("|")]);

    const handleOpen = () => {
        setData({
            title: subcategory?.title ?? "",
            slug: subcategory?.slug ?? "",
            category_ids: subcategory?.parent_ids ?? [],
            types: subcategory?.types?.length ? subcategory.types : [activeType],
        });
        clearErrors();
        setOpen(true);
    };

    const handleClose = () => {
        reset();
        setOpen(false);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            only: ONLY_PROPS,
            onSuccess: () => handleClose(),
            onError: (errs: Record<string, string>) => {
                const first = Object.values(errs)[0];
                if (first) toast.error(first);
            },
        };

        isEdit
            ? put(route("admin.categories.update", subcategory!.id), options)
            : post(route("admin.categories.store"), options);
    };

    return (
        <>
            {/* Same pattern — trigger is a plain onClick, no Radix Slot needed */}
            {isEdit ? (
                <IconButton icon={<PencilLine className="size-4" />} onClick={handleOpen} />
            ) : (
                <Button variant="outline" className="font-normal cursor-pointer" onClick={handleOpen}>
                    Add Subcategory
                </Button>
            )}

            <Dialog open={open} onOpenChange={(next) => { if (!next) handleClose(); }}>
                <DialogContent className="max-w-2xl bg-[#FDF7F7]">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-semibold font-alumni">
                            {isEdit ? "Edit Subcategory" : "Add Subcategory"}
                        </DialogTitle>
                        <DialogDescription
                            className="text-sm text-muted-foreground"
                        >
                            {isEdit ? "Edit the subcategory." : "Add a new subcategory."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="flex flex-col gap-5 py-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-lg font-medium font-alumni">
                                Types
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {(typeSelectionDisabled ? productTypes : productTypes.filter((t) => allowedTypeValues.includes(t.value))).map((t) => {
                                    const selected = data.types.includes(t.value);
                                    return (
                                        <button
                                            key={t.value}
                                            type="button"
                                            disabled={typeSelectionDisabled}
                                            onClick={() => {
                                                setData(
                                                    "types",
                                                selected
                                                    ? (data.types.length === 1
                                                        ? data.types
                                                        : data.types.filter((x) => x !== t.value))
                                                        : [...data.types, t.value]
                                                );
                                            }}
                                            className={cn(
                                                "px-3 py-2 rounded-md text-sm border transition-colors",
                                                typeSelectionDisabled && "opacity-50 cursor-not-allowed",
                                                selected
                                                    ? "bg-red-700 text-white border-red-700"
                                                    : "bg-[#1103040A] text-stone-700 border-stone-200 hover:bg-stone-100"
                                            )}
                                        >
                                            {t.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.types as unknown as string} />
                            {typeSelectionDisabled && (
                                <p className="text-xs text-stone-500">
                                    Select a parent category to choose types.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-lg font-medium font-alumni">
                                Select Categories
                            </Label>
                            <MultiSelect
                                options={categoriesForSelect}
                                selected={selectedCategories}
                                onChange={(sel) => setData("category_ids", sel.map((s) => s.id))}
                                placeholder="Add categories..."
                            />
                            <InputError message={errors.category_ids as unknown as string} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="sub-title" className="text-lg font-medium font-alumni">
                                Subcategory Name
                            </Label>
                            <Input
                                id="sub-title"
                                value={data.title}
                                onChange={(e) => setData("title", e.target.value)}
                                placeholder="Enter subcategory name"
                                className="bg-[#1103040A] rounded"
                                required
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="sub-slug" className="text-lg font-medium font-alumni">
                                Slug
                            </Label>
                            <Input
                                id="sub-slug"
                                value={data.slug}
                                onChange={(e) => setData("slug", e.target.value)}
                                placeholder="subcategory-slug-example"
                                className="bg-[#1103040A] rounded"
                                required
                            />
                            <InputError message={errors.slug} />
                        </div>

                        <DialogFooter className="sm:justify-start">
                            <Button
                                type="submit"
                                className="font-normal cursor-pointer"
                                disabled={processing}
                            >
                                {processing ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}