import { useState, useEffect, useRef } from "react";
import { Link, router, usePage } from "@inertiajs/react";
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
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { PencilLine, Trash, PackageOpen } from "lucide-react";

/* ─────────────────────────────────────────────────────────────── */
/* Types                                                           */
/* ─────────────────────────────────────────────────────────────── */

export interface Product {
    id: number;
    title: string;
    slug: string;
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

export interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
}

interface PageProps {
    products?: PaginatedProducts;
    activeType?: string;
    productTypes?: EnumOption[];
    success?: string;
}

/* ─────────────────────────────────────────────────────────────── */
/* Pagination helper                                               */
/* ─────────────────────────────────────────────────────────────── */

function buildPageRange(current: number, last: number): (number | "…")[] {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);

    const range: (number | "…")[] = [];
    const addRange = (from: number, to: number) => {
        for (let i = from; i <= to; i++) range.push(i);
    };

    range.push(1);
    if (current <= 4) {
        addRange(2, 5);
        range.push("…");
    } else if (current >= last - 3) {
        range.push("…");
        addRange(last - 4, last - 1);
    } else {
        range.push("…");
        addRange(current - 1, current + 1);
        range.push("…");
    }
    range.push(last);
    return range;
}

/* ─────────────────────────────────────────────────────────────── */
/* Page                                                            */
/* ─────────────────────────────────────────────────────────────── */

export default function ProductIndex({
    products,
    activeType = "men",
    productTypes = [],
}: PageProps) {
    const paginator = products ?? {
        data: [], current_page: 1, last_page: 1,
        per_page: 12, total: 0, from: null, to: null, links: [],
    };

    const { success } = usePage().props as unknown as PageProps;
    const shownRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (success && success !== shownRef.current) {
            shownRef.current = success;
            toast.success(success);
        }
    }, [success]);

    const goToPage = (page: number) => {
        router.get(
            route("admin.products.index"),
            { type: activeType, page },
            { preserveState: true, preserveScroll: false, only: ["products"] }
        );
    };

    const handleTypeChange = (type: string) => {
        router.get(
            route("admin.products.index"),
            { type, page: 1 },
            { preserveState: true, preserveScroll: true, only: ["products", "activeType"] }
        );
    };

    const pageRange = buildPageRange(paginator.current_page, paginator.last_page);

    return (
        <AdminLayout
            title="Product Management"
            description="View, edit, and manage your inventory in one place."
        >
            <section className="p-4 md:p-10 font-sans rounded-lg shadow-sm border border-destructive">

                {/* ── Header ── */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <Tabs value={activeType} onValueChange={handleTypeChange}>
                        <TabsList className="bg-[#1103040A] h-auto p-2 gap-0.5">
                            {productTypes.map((t) => (
                                <TabsTrigger
                                    key={t.value}
                                    value={t.value}
                                    className="
                                        px-5 text-lg font-medium font-alumni capitalize
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

                    <div className="flex items-center gap-4">
                        {paginator.total > 0 && (
                            <p className="text-sm text-stone-400 hidden sm:block">
                                Showing{" "}
                                <span className="font-medium text-stone-600">
                                    {paginator.from}–{paginator.to}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium text-stone-600">
                                    {paginator.total}
                                </span>
                            </p>
                        )}
                        <Link href={`${route("admin.products.create")}?type=${activeType}`}>
                            <Button className="font-normal cursor-pointer bg-red-700 hover:bg-red-800 text-white">
                                Add New Product
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* ── Grid ── */}
                {paginator.data.length === 0 ? (
                    <EmptyState activeType={activeType} productTypes={productTypes} />
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {paginator.data.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    activeType={activeType}
                                    currentPage={paginator.current_page}
                                />
                            ))}
                        </div>

                        {paginator.last_page > 1 && (
                            <ProductPagination
                                currentPage={paginator.current_page}
                                lastPage={paginator.last_page}
                                pageRange={pageRange}
                                onPageChange={goToPage}
                            />
                        )}
                    </>
                )}
            </section>
        </AdminLayout>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/* ProductPagination                                               */
/* ─────────────────────────────────────────────────────────────── */

function ProductPagination({
    currentPage,
    lastPage,
    pageRange,
    onPageChange,
}: {
    currentPage: number;
    lastPage: number;
    pageRange: (number | "…")[];
    onPageChange: (page: number) => void;
}) {
    const linkClass = (active: boolean) =>
        `cursor-pointer select-none h-9 min-w-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors
        ${active
            ? "bg-red-700 text-white border border-red-700 hover:bg-red-800"
            : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
        }`;

    return (
        <Pagination>
            <PaginationContent className="flex-wrap gap-1">
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                        className={`cursor-pointer border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-colors ${currentPage === 1 ? "pointer-events-none opacity-40" : ""}`}
                        aria-disabled={currentPage === 1}
                    />
                </PaginationItem>

                {pageRange.map((page, idx) =>
                    page === "…" ? (
                        <PaginationItem key={`ellipsis-${idx}`}>
                            <PaginationEllipsis className="text-stone-400" />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={page}>
                            <PaginationLink
                                isActive={page === currentPage}
                                onClick={() => page !== currentPage && onPageChange(page)}
                                className={linkClass(page === currentPage)}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}

                <PaginationItem>
                    <PaginationNext
                        onClick={() => currentPage < lastPage && onPageChange(currentPage + 1)}
                        className={`cursor-pointer border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-colors ${currentPage === lastPage ? "pointer-events-none opacity-40" : ""}`}
                        aria-disabled={currentPage === lastPage}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/* EmptyState                                                      */
/* ─────────────────────────────────────────────────────────────── */

function EmptyState({ activeType, productTypes }: { activeType: string; productTypes: EnumOption[] }) {
    const label = productTypes.find((t) => t.value === activeType)?.label ?? activeType;
    return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <PackageOpen className="size-12 opacity-30" />
            <p className="text-sm">
                No <span className="font-medium capitalize">{label}</span> products yet. Add your first one.
            </p>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/* ProductCard                                                     */
/*                                                                 */
/* The entire card is a clickable area navigating to the details  */
/* page. Edit and Delete buttons stop event propagation so they   */
/* don't also trigger the card navigation.                        */
/* ─────────────────────────────────────────────────────────────── */

function ProductCard({
    product,
    activeType,
    currentPage,
}: {
    product: Product;
    activeType: string;
    currentPage: number;
}) {
    const statusColour =
        product.status === "active" ? "bg-green-500" :
            product.status === "inactive" ? "bg-stone-400" :
                product.status === "draft" ? "bg-amber-400" : "bg-stone-400";

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => router.visit(route("admin.products.show", product.id))}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.visit(route("admin.products.show", product.id));
                }
            }}
            className="bg-[#1103040A] rounded-lg border border-border-primary flex flex-col overflow-hidden cursor-pointer group/card hover:shadow-md hover:border-red-200 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
        >
            {/* Image */}
            <div className="relative overflow-hidden bg-gray-100 aspect-square">
                {product.primary_image_url ? (
                    <img
                        src={product.primary_image_url}
                        alt={product.title}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover/card:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <PackageOpen className="size-10 opacity-40" />
                    </div>
                )}
                <span className={`absolute bottom-2 left-0 text-white text-xs px-2 py-1 capitalize ${statusColour}`}>
                    {product.status}
                </span>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1 gap-3">
                <div className="flex-1">
                    <h3 className="font-alumni text-xl font-semibold leading-tight">{product.title}</h3>
                    <p className="text-xs font-mono text-stone-400 mt-0.5 truncate">/{product.slug}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                </div>

                <p className="text-base font-semibold font-alumni">
                    ${Number(product.price).toFixed(2)}
                </p>

                {/* Actions — stopPropagation prevents card navigation */}
                <div
                    className="flex items-center gap-2 pt-1"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                >
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
                        currentPage={currentPage}
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
    currentPage,
}: {
    id: number;
    title: string;
    activeType: string;
    currentPage: number;
}) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(route("admin.products.destroy", id), {
            data: { type: activeType, page: currentPage },
            preserveScroll: true,
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
                            <span className="text-2xl font-bold">Delete product "{title}"?</span>
                            <br />
                            <span className="text-stone-400 text-base font-normal">
                                This action cannot be undone.
                            </span>
                        </DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className="font-normal cursor-pointer">
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