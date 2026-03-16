import { useState, useEffect } from "react";
import { router, Link } from "@inertiajs/react";
import { toast } from "sonner";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PencilLine, Trash, PackageOpen } from "lucide-react";

/* ─────────────────────────────────────────────────────────────── */
/* Types                                                           */
/* ─────────────────────────────────────────────────────────────── */

export interface Product {
    id: number;
    title: string;
    description: string | null;
    price: string;
    status: string;
    type: string;
    primary_image_url: string | null;
}

export interface EnumOption {
    value: string;
    label: string;
}

interface PageProps {
    products?: Product[];
    activeType?: string;
    productTypes?: EnumOption[];
    success?: string;
}

interface FlashProps {
    success?: string;
}

const ONLY_PROPS = ["products", "activeType"];

/* ─────────────────────────────────────────────────────────────── */
/* Page                                                            */
/* ─────────────────────────────────────────────────────────────── */

export default function ProductIndex({
    products = [],
    activeType = "men",
    productTypes = [],
}: PageProps) {

    /* Flash toast */
    useEffect(() => {
        return router.on("success", (event) => {
            const { success } = event.detail.page.props as unknown as FlashProps;
            if (success) toast.success(success);
        });
    }, []);

    /* Switch tab → reload with new type, partial update only products */
    const handleTypeChange = (type: string) => {
        router.get(
            route("admin.products.index"),
            { type },
            {
                preserveState: true,
                preserveScroll: true,
                only: ONLY_PROPS
            });
    };

    return (
        <AdminLayout
            title="Product Management"
            description="View, edit, and manage your inventory in one place."
        >
            <section className="p-4 md:p-10 font-sans rounded-lg shadow-sm border border-destructive">

                {/* ── Header row ── */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

                    {/* Type tabs — left side */}
                    <Tabs value={activeType} onValueChange={handleTypeChange}>
                        <TabsList className="bg-[#1103040A] h-10 p-1 gap-0.5">
                            {productTypes.map((t) => (
                                <TabsTrigger
                                    key={t.value}
                                    value={t.value}
                                    className="
                                        px-5 text-sm font-medium font-alumni capitalize
                                        text-stone-600
                                        data-[state=active]:bg-red-700
                                        data-[state=active]:text-white
                                        data-[state=active]:shadow-sm
                                        rounded-md transition-all duration-150
                                        cursor-pointer
                                    "
                                >
                                    {t.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    {/* Add New Product — carries active type as query param */}
                    <Link href={`${route("admin.products.create")}?type=${activeType}`}>
                        <Button className="font-normal cursor-pointer bg-red-700 hover:bg-red-800 text-white">
                            Add New Product
                        </Button>
                    </Link>
                </div>

                {/* ── Product grid ── */}
                {products.length === 0 ? (
                    <EmptyState activeType={activeType} productTypes={productTypes} />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                activeType={activeType}
                            />
                        ))}
                    </div>
                )}
            </section>
        </AdminLayout>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/* EmptyState                                                      */
/* ─────────────────────────────────────────────────────────────── */

function EmptyState({
    activeType,
    productTypes,
}: {
    activeType: string;
    productTypes: EnumOption[];
}) {
    const label =
        productTypes.find((t) => t.value === activeType)?.label ?? activeType;

    return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <PackageOpen className="size-12 opacity-30" />
            <p className="text-sm">
                No <span className="font-medium capitalize">{label}</span> products yet.
                Add your first one.
            </p>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/* ProductCard                                                     */
/* ─────────────────────────────────────────────────────────────── */

function ProductCard({
    product,
    activeType,
}: {
    product: Product;
    activeType: string;
}) {
    return (
        <div className="bg-[#1103040A] rounded-lg border border-border-primary flex flex-col overflow-hidden">

            {/* Image */}
            <div className="relative group overflow-hidden bg-gray-100 aspect-square">
                {product.primary_image_url ? (
                    <img
                        src={product.primary_image_url}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <PackageOpen className="size-10 opacity-40" />
                    </div>
                )}

                {/* Status badge */}
                <span
                    className={`
                        absolute bottom-2 left-0 text-white text-xs px-2 py-1 capitalize
                        ${product.status === "active" ? "bg-green-500" : ""}
                        ${product.status === "inactive" ? "bg-stone-400" : ""}
                        ${product.status === "draft" ? "bg-amber-400" : ""}
                    `}
                >
                    {product.status}
                </span>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1 gap-3">
                <div className="flex-1">
                    <h3 className="font-alumni text-xl font-semibold leading-tight">
                        {product.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {product.description}
                    </p>
                </div>

                <p className="text-base font-semibold font-alumni">
                    ${Number(product.price).toFixed(2)}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                    <Link
                        href={route("admin.products.edit", product.id)}
                        className="flex-1 flex items-center justify-center gap-2 border border-green-600 text-green-600 py-2 rounded hover:bg-green-50 transition-colors text-sm font-medium"
                    >
                        <PencilLine className="size-3.5" /> Edit
                    </Link>
                    <DeleteDialog
                        id={product.id}
                        title={product.title}
                        activeType={activeType}
                    />
                </div>
            </div>
        </div>
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
        router.delete(`${route("admin.products.destroy", id)}?type=${activeType}`, {
            preserveScroll: true,
            // After delete, reload keeping the current type tab active
            data: { type: activeType },
            only: ONLY_PROPS,
            onSuccess: () => setOpen(false),
            onError: () => toast.error("Failed to delete. Please try again."),
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded hover:bg-red-50 transition-colors text-sm font-medium cursor-pointer"
            >
                <Trash className="size-3.5" /> Delete
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md bg-[#FDF7F7]">
                    <DialogHeader>
                        <DialogTitle className="font-alumni">
                            Delete product "{title}"?
                        </DialogTitle>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end gap-2">
                        <DialogClose asChild>
                            <Button
                                variant="secondary"
                                className="font-normal cursor-pointer"
                            >
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