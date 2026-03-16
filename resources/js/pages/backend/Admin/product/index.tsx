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
import { PencilLine, Trash, PackageOpen } from "lucide-react";

/* ─────────────────────────────────────────────────────────────── */
/* Types                                                           */
/* ─────────────────────────────────────────────────────────────── */

export interface Product {
    id: number;
    name: string;
    description: string;
    image: string;
    price: number;
    stock: number;
    category_id: number | null;
}

interface PageProps {
    products?: Product[];
    success?: string;
}

interface FlashProps {
    success?: string;
}

const ONLY_PROPS: string[] = ["products", "success"];

/* ─────────────────────────────────────────────────────────────── */
/* Page                                                            */
/* ─────────────────────────────────────────────────────────────── */

export default function ProductIndex({ products = [] }: PageProps) {
    useEffect(() => {
        return router.on("success", (event) => {
            const { success } = event.detail.page.props as unknown as FlashProps;
            if (success) toast.success(success);
        });
    }, []);

    return (
        <AdminLayout
            title="Product Management"
            description="View, edit, and manage your inventory in one place."
        >
            <section className="p-4 md:p-10 font-sans rounded-lg shadow-sm border border-destructive">
                {/* ── Header ── */}
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-semibold font-alumni text-text-primary">
                        Products
                    </h3>
                    <Link href={route("admin.products.create")}>
                        <Button className="font-normal cursor-pointer">
                            Add New Product
                        </Button>
                    </Link>
                </div>

                {/* ── Grid ── */}
                {products.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
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

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <PackageOpen className="size-12 opacity-30" />
            <p className="text-sm">No products yet. Add your first one.</p>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/* ProductCard                                                     */
/* ─────────────────────────────────────────────────────────────── */

function ProductCard({ product }: { product: Product }) {
    return (
        <div className="bg-[#1103040A] rounded-lg border border-border-primary flex flex-col overflow-hidden">
            {/* Image */}
            <div className="relative group overflow-hidden bg-gray-100 aspect-square">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-0 bg-green-500 text-white text-xs px-2 py-1">
                    Stock {product.stock}
                </span>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1 gap-3">
                <div className="flex-1">
                    <h3 className="font-alumni text-xl font-semibold leading-tight">
                        {product.name}
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
                    <DeleteDialog id={product.id} name={product.name} />
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/* DeleteDialog                                                    */
/* ─────────────────────────────────────────────────────────────── */

function DeleteDialog({ id, name }: { id: number; name: string }) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(route("admin.products.destroy", id), {
            preserveScroll: true,
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
                            Delete product "{name}"?
                        </DialogTitle>
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