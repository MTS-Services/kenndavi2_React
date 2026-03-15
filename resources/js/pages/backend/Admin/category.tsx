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
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import AdminLayout from "@/layouts/admin-layout";
import { Check, ChevronsUpDown, PencilLine, Trash, X } from "lucide-react";
import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CategoryItem = (typeof CATEGORIES)[number];

const CATEGORIES = [
    {
        id: 1,
        name: "Category 1",
        subcategories: [
            { id: 1, name: "Subcategory 1" },
            { id: 2, name: "Subcategory 2" },
            { id: 3, name: "Subcategory 3" },
        ],
    },
    {
        id: 2,
        name: "Category 2",
        subcategories: [
            { id: 1, name: "Subcategory 1" },
            { id: 2, name: "Subcategory 2" },
        ],
    },
    {
        id: 3,
        name: "Category 3",
        subcategories: [
            { id: 1, name: "Subcategory 1" },
            { id: 2, name: "Subcategory 2" },
        ],
    },
    {
        id: 4,
        name: "Category 4",
        subcategories: [
            { id: 1, name: "Subcategory 1" },
            { id: 2, name: "Subcategory 2" },
        ],
    },
    {
        id: 5,
        name: "Category 5",
        subcategories: [
            { id: 1, name: "Subcategory 1" },
            { id: 2, name: "Subcategory 2" },
        ],
    },
];

/* -------------------------------------------------------------------------- */
/* Multi-Select Component (Command + Popover)                                  */
/* -------------------------------------------------------------------------- */

interface MultiSelectProps {
    options: CategoryItem[];
    selected: CategoryItem[];
    onChange: (selected: CategoryItem[]) => void;
    placeholder?: string;
}

function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select options...",
}: MultiSelectProps) {
    const [open, setOpen] = useState(false);

    const toggle = (item: CategoryItem) => {
        const isSelected = selected.some((s) => s.id === item.id);
        if (isSelected) {
            onChange(selected.filter((s) => s.id !== item.id));
        } else {
            onChange([...selected, item]);
        }
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
                        "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded border border-input bg-[#1103040A] px-3 py-2 text-sm shadow-sm transition-colors",
                        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                        "hover:bg-[#1103040A]/80"
                    )}
                >
                    <div className="flex-1 flex flex-wrap items-center gap-1.5">
                        {selected.length === 0 ? (
                            <span className="text-muted-foreground">{placeholder}</span>
                        ) : (
                            selected.map((item) => (
                                <Badge
                                    key={item.id}
                                    variant="secondary"
                                    className="flex items-center gap-1 pr-1 bg-[#ffccd1A0]"
                                >
                                    {item.name}
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
                                        className="ml-0.5 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer text-[#110304B8]"
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
                                        value={item.name}
                                        onSelect={() => toggle(item)}
                                        className="cursor-pointer text-[#110304B8]"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                isSelected ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {item.name}
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

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function CategoryIndex() {
    return (
        <AdminLayout title="Category Management" description="Manage your categories effectively.">
            <section className="p-4 md:p-10 font-sans rounded-lg shadow-sm border border-destructive">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-semibold font-alumni text-text-primary">Categories</h3>
                    <div className="flex items-center justify-end gap-7">
                        <CategoryFormModal
                            trigger={
                                <Button className="font-normal cursor-pointer">Add Category</Button>
                            }
                        />
                        <SubcategoryFormModal
                            trigger={
                                <Button variant="outline" className="font-normal cursor-pointer">
                                    Add Subcategory
                                </Button>
                            }
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-5">
                    {CATEGORIES.map((category) => (
                        <Card key={category.id} category={category} />
                    ))}
                </div>
            </section>
        </AdminLayout>
    );
}

/* -------------------------------------------------------------------------- */
/* Card                                                                        */
/* -------------------------------------------------------------------------- */

function Card({ category }: { category: any }) {
    return (
        <div className="bg-[#1103040A] p-4 rounded-lg border border-border-primary">
            <div className="flex items-center justify-between gap-4">
                <h2 className="font-alumni text-2xl font-semibold">{category.name}</h2>
                <div className="flex items-center justify-center gap-2">
                    <CategoryFormModal
                        id={category.id}
                        trigger={
                            <button className="rounded-md p-2 bg-[#FDF7F7] flex items-center justify-center cursor-pointer">
                                <PencilLine className="size-4" />
                            </button>
                        }
                    />
                    <button className="rounded-md p-2 bg-[#FDF7F7] flex items-center justify-center cursor-pointer">
                        <Trash className="size-4" />
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-4 pl-2 mt-4">
                {category.subcategories.map((subcategory: any) => (
                    <div key={subcategory.id} className="flex items-center justify-between gap-4">
                        <h3 className="font-libre">{subcategory.name}</h3>
                        <div className="flex items-center justify-center gap-2">
                            <SubcategoryFormModal
                                id={subcategory.id}
                                trigger={
                                    <button className="rounded-md p-2 bg-[#FDF7F7] flex items-center justify-center cursor-pointer">
                                        <PencilLine className="size-4" />
                                    </button>
                                }
                            />
                            <button className="rounded-md p-2 bg-[#FDF7F7] flex items-center justify-center cursor-pointer">
                                <Trash className="size-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Category Form Modal                                                         */
/* -------------------------------------------------------------------------- */

function CategoryFormModal({ id, trigger }: { id?: number; trigger: ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-2xl bg-[#FDF7F7]">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-semibold font-alumni">
                        {id ? "Edit Category" : "Add Category"}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-5 py-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="category-name" className="text-lg font-medium font-alumni">
                            Category Name
                        </Label>
                        <Input
                            id="category-name"
                            placeholder="Enter category name"
                            className="bg-[#1103040A] rounded"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="category-slug" className="text-lg font-medium font-alumni">
                            Slug
                        </Label>
                        <Input
                            id="category-slug"
                            placeholder="category-slug-example"
                            className="bg-[#1103040A] rounded"
                        />
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <Button className="font-normal cursor-pointer" onClick={() => setOpen(false)}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/* -------------------------------------------------------------------------- */
/* Subcategory Form Modal                                                      */
/* -------------------------------------------------------------------------- */

function SubcategoryFormModal({ id, trigger }: { id?: number; trigger: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<CategoryItem[]>([]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-2xl bg-[#FDF7F7]">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-semibold font-alumni">
                        {id ? "Edit Subcategory" : "Add Subcategory"}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-5 py-4">
                    <div className="flex flex-col gap-2">
                        <Label className="text-lg font-medium font-alumni">Select Categories</Label>
                        <MultiSelect
                            options={CATEGORIES}
                            selected={selectedCategories}
                            onChange={setSelectedCategories}
                            placeholder="Add categories..."
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="subcategory-name" className="text-lg font-medium font-alumni">
                            Subcategory Name
                        </Label>
                        <Input
                            id="subcategory-name"
                            placeholder="Enter subcategory name"
                            className="bg-[#1103040A] rounded"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="subcategory-slug" className="text-lg font-medium font-alumni">
                            Slug
                        </Label>
                        <Input
                            id="subcategory-slug"
                            placeholder="subcategory-slug-example"
                            className="bg-[#1103040A] rounded"
                        />
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <Button className="font-normal cursor-pointer" onClick={() => setOpen(false)}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
