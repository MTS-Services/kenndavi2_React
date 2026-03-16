/**
 * VariantMatrix
 *
 * UX: instead of one row per variant, the user:
 *  1. Types in sizes and hits Enter / "Add" → size tags appear
 *  2. Picks colors via a colour-picker swatch → colour swatches appear
 *  3. Fills a size × colour grid – one quantity input per cell
 *
 * On submit the parent calls `getVariants()` which flattens the matrix
 * into the array the server expects:
 *   [{ size, color, quantity }, ...]
 *
 * Edit mode:  pass `existingVariants` – the component reconstructs
 * sizes, colours and the quantity matrix automatically.
 */

import {
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
    forwardRef,
    KeyboardEvent,
} from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────── */
/* Public types                                                    */
/* ─────────────────────────────────────────────────────────────── */

export interface FlatVariant {
    size: string;
    color: string;   // hex  e.g. "#ff0000"
    quantity: number;
    existingId?: number; // present only for pre-existing DB rows
}

export interface ExistingVariant {
    id: number;
    size?: { name: string } | null;
    color?: { hex: string; name?: string } | null;
    quantity?: number;
}

export interface VariantMatrixRef {
    /** Returns every cell that has a non-zero (or non-empty) quantity */
    getVariants(): FlatVariant[];
    /** Returns ids of variants that were present on load but are now removed */
    getRemovedIds(): number[];
}

interface VariantMatrixProps {
    existingVariants?: ExistingVariant[];
    className?: string;
}

/* ─────────────────────────────────────────────────────────────── */
/* Helpers                                                         */
/* ─────────────────────────────────────────────────────────────── */

const matrixKey = (size: string, color: string) => `${size}::${color}`;

/** normalise a hex value → always #rrggbb */
const normaliseHex = (h: string) =>
    `#${h.replace("#", "").toLowerCase().padStart(6, "0")}`;

/** relative luminance → decide if label should be black or white */
const textOnColor = (hex: string): "white" | "black" => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const lum =
        0.2126 * (r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4) +
        0.7152 * (g <= 0.03928 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4) +
        0.0722 * (b <= 0.03928 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4);
    return lum > 0.179 ? "black" : "white";
};

/* ─────────────────────────────────────────────────────────────── */
/* Component                                                       */
/* ─────────────────────────────────────────────────────────────── */

const fieldStyle =
    "bg-[#1103040A] border-0 rounded-md focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-0 shadow-none text-stone-800 placeholder:text-stone-400";

const VariantMatrix = forwardRef<VariantMatrixRef, VariantMatrixProps>(
    function VariantMatrix({ existingVariants = [], className }, ref) {

        /* ── Reconstruct from existing variants ── */
        const initFromExisting = () => {
            const sizeSet: string[] = [];
            const colorSet: string[] = [];
            const qty: Record<string, number> = {};
            const idMap: Record<string, number> = {};

            for (const v of existingVariants) {
                const size = v.size?.name ?? "";
                const color = normaliseHex(v.color?.hex ?? "#000000");
                if (size && !sizeSet.includes(size)) sizeSet.push(size);
                if (color && !colorSet.includes(color)) colorSet.push(color);
                if (size && color) {
                    const k = matrixKey(size, color);
                    qty[k] = v.quantity ?? 0;
                    idMap[k] = v.id;
                }
            }
            return { sizeSet, colorSet, qty, idMap };
        };

        const init = initFromExisting();

        const [sizes, setSizes] = useState<string[]>(init.sizeSet);
        const [colors, setColors] = useState<string[]>(init.colorSet);
        const [quantities, setQuantities] = useState<Record<string, number>>(init.qty);
        /** Tracks which matrix keys map to an existing DB variant id */
        const [existingIdMap, setExistingIdMap] = useState<Record<string, number>>(init.idMap);
        /** Ids removed during this edit session */
        const [removedIds, setRemovedIds] = useState<number[]>([]);

        /* ── Size input ── */
        const [sizeInput, setSizeInput] = useState("");

        const addSize = () => {
            const val = sizeInput.trim().toUpperCase();
            if (val && !sizes.includes(val)) setSizes((p) => [...p, val]);
            setSizeInput("");
        };

        const removeSize = (size: string) => {
            // Track any existing variant ids that will be deleted
            const idsToRemove: number[] = [];
            for (const color of colors) {
                const id = existingIdMap[matrixKey(size, color)];
                if (id) idsToRemove.push(id);
            }
            if (idsToRemove.length) setRemovedIds((p) => [...p, ...idsToRemove]);
            setSizes((p) => p.filter((s) => s !== size));
        };

        /* ── Colour input ── */
        const [colorPicker, setColorPicker] = useState("#000000");
        const colorPickerRef = useRef<HTMLInputElement>(null);

        const addColor = () => {
            const hex = normaliseHex(colorPicker);
            if (!colors.includes(hex)) setColors((p) => [...p, hex]);
        };

        const removeColor = (color: string) => {
            const idsToRemove: number[] = [];
            for (const size of sizes) {
                const id = existingIdMap[matrixKey(size, color)];
                if (id) idsToRemove.push(id);
            }
            if (idsToRemove.length) setRemovedIds((p) => [...p, ...idsToRemove]);
            setColors((p) => p.filter((c) => c !== color));
        };

        /* ── Quantity cell ── */
        const setQty = (size: string, color: string, value: string) => {
            const num = parseInt(value, 10);
            setQuantities((p) => ({
                ...p,
                [matrixKey(size, color)]: isNaN(num) ? 0 : Math.max(0, num),
            }));
        };

        /* ── "Fill all" helper: set same quantity across an entire row or column ── */
        const fillRow = (size: string, value: string) => {
            const num = parseInt(value, 10);
            if (isNaN(num)) return;
            setQuantities((prev) => {
                const next = { ...prev };
                for (const color of colors) {
                    next[matrixKey(size, color)] = Math.max(0, num);
                }
                return next;
            });
        };

        const fillColumn = (color: string, value: string) => {
            const num = parseInt(value, 10);
            if (isNaN(num)) return;
            setQuantities((prev) => {
                const next = { ...prev };
                for (const size of sizes) {
                    next[matrixKey(size, color)] = Math.max(0, num);
                }
                return next;
            });
        };

        /* ── Imperative handle for parent to read values on submit ── */
        useImperativeHandle(ref, () => ({
            getVariants() {
                const result: FlatVariant[] = [];
                for (const size of sizes) {
                    for (const color of colors) {
                        const k = matrixKey(size, color);
                        const qty = quantities[k] ?? 0;
                        result.push({
                            size,
                            color,
                            quantity: qty,
                            existingId: existingIdMap[k],
                        });
                    }
                }
                return result;
            },
            getRemovedIds() {
                return removedIds;
            },
        }));

        const hasMatrix = sizes.length > 0 && colors.length > 0;

        return (
            <TooltipProvider>
                <div className={cn("flex flex-col gap-5", className)}>

                    {/* ── Size + Colour selectors ─────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Sizes */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-base font-bold text-stone-900 font-alumni">
                                Sizes
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    value={sizeInput}
                                    onChange={(e) => setSizeInput(e.target.value)}
                                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addSize();
                                        }
                                    }}
                                    placeholder="Type size, press Enter (e.g. S, M, XL, 40)"
                                    className={cn(fieldStyle, "h-11 flex-1")}
                                />
                                <Button
                                    type="button"
                                    onClick={addSize}
                                    variant="outline"
                                    className="h-11 px-4 border-stone-300 bg-transparent hover:bg-stone-100 text-stone-700 cursor-pointer"
                                >
                                    <Plus className="size-4" />
                                </Button>
                            </div>

                            {/* Size tags */}
                            {sizes.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {sizes.map((size) => (
                                        <Badge
                                            key={size}
                                            variant="outline"
                                            className="px-3 py-1.5 text-sm font-medium border-stone-300 text-stone-700 gap-1.5 cursor-default"
                                        >
                                            {size}
                                            <button
                                                type="button"
                                                onClick={() => removeSize(size)}
                                                className="ml-0.5 text-stone-400 hover:text-red-600 transition-colors"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Colours */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-base font-bold text-stone-900 font-alumni">
                                Colors
                            </Label>
                            <div className="flex gap-2">
                                <div
                                    className={cn(
                                        fieldStyle,
                                        "flex-1 flex items-center gap-3 h-11 px-3 rounded-md cursor-pointer"
                                    )}
                                    onClick={() => colorPickerRef.current?.click()}
                                >
                                    {/* Colour preview swatch */}
                                    <span
                                        className="size-6 rounded-full border border-stone-200 shrink-0 transition-colors"
                                        style={{ backgroundColor: colorPicker }}
                                    />
                                    <span className="text-sm text-stone-600 font-mono flex-1">
                                        {colorPicker}
                                    </span>
                                    <input
                                        ref={colorPickerRef}
                                        type="color"
                                        value={colorPicker}
                                        onChange={(e) => setColorPicker(e.target.value)}
                                        className="sr-only"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={addColor}
                                    variant="outline"
                                    className="h-11 px-4 border-stone-300 bg-transparent hover:bg-stone-100 text-stone-700 cursor-pointer"
                                >
                                    <Plus className="size-4" />
                                </Button>
                            </div>

                            {/* Colour swatches */}
                            {colors.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {colors.map((color) => (
                                        <Tooltip key={color}>
                                            <TooltipTrigger asChild>
                                                <div className="relative group">
                                                    <span
                                                        className="flex size-8 rounded-full border-2 border-white shadow-sm cursor-default"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeColor(color)}
                                                        className="absolute -top-1 -right-1 size-4 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                    >
                                                        <X className="size-2.5" />
                                                    </button>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">
                                                <p className="font-mono text-xs">{color}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Variant Matrix grid ──────────────────────── */}
                    {hasMatrix && (
                        <div className="overflow-x-auto rounded-lg border border-stone-200">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-[#1103040A]">
                                        {/* Top-left corner: "Size \ Color" label */}
                                        <th className="px-4 py-3 text-left text-stone-500 font-medium border-b border-stone-200 border-r border-stone-200 min-w-[90px]">
                                            <span className="text-xs">Size \ Color</span>
                                        </th>

                                        {/* Color column headers */}
                                        {colors.map((color) => (
                                            <th
                                                key={color}
                                                className="px-3 py-3 text-center border-b border-stone-200 border-r border-stone-200 last:border-r-0 min-w-[110px]"
                                            >
                                                <div className="flex flex-col items-center gap-1.5">
                                                    {/* Swatch */}
                                                    <span
                                                        className="size-6 rounded-full border border-stone-200 shrink-0"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                    <span className="font-mono text-xs text-stone-500">
                                                        {color}
                                                    </span>
                                                    {/* Fill-column shortcut */}
                                                    {sizes.length > 1 && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    placeholder="Fill all"
                                                                    onChange={(e) =>
                                                                        fillColumn(color, e.target.value)
                                                                    }
                                                                    className="w-20 h-7 text-xs text-center rounded bg-stone-100 border-0 focus:ring-2 focus:ring-red-500 outline-none placeholder:text-stone-400"
                                                                />
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top">
                                                                <p className="text-xs">
                                                                    Set this qty for all sizes
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {sizes.map((size, sIdx) => (
                                        <tr
                                            key={size}
                                            className={
                                                sIdx % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-[#1103040A]/40"
                                            }
                                        >
                                            {/* Size row header */}
                                            <td className="px-4 py-3 border-r border-stone-200">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold font-alumni text-stone-800 text-base">
                                                        {size}
                                                    </span>
                                                    {/* Fill-row shortcut */}
                                                    {colors.length > 1 && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    placeholder="→ all"
                                                                    onChange={(e) =>
                                                                        fillRow(size, e.target.value)
                                                                    }
                                                                    className="w-16 h-7 text-xs text-center rounded bg-stone-100 border-0 focus:ring-2 focus:ring-red-500 outline-none placeholder:text-stone-400"
                                                                />
                                                            </TooltipTrigger>
                                                            <TooltipContent side="right">
                                                                <p className="text-xs">
                                                                    Set this qty for all colors
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Quantity cells */}
                                            {colors.map((color) => {
                                                const k = matrixKey(size, color);
                                                const qty = quantities[k] ?? 0;
                                                return (
                                                    <td
                                                        key={color}
                                                        className="px-3 py-2.5 text-center border-r border-stone-200 last:border-r-0"
                                                    >
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={qty === 0 ? "" : qty}
                                                            onChange={(e) =>
                                                                setQty(size, color, e.target.value)
                                                            }
                                                            placeholder="0"
                                                            className="w-full h-9 text-center rounded-md bg-[#1103040A] border-0 text-stone-800 text-sm focus:ring-2 focus:ring-red-600 outline-none placeholder:text-stone-300 font-medium"
                                                        />
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Empty state hint */}
                    {!hasMatrix && (
                        <p className="text-sm text-stone-400 text-center py-6 border border-dashed border-stone-200 rounded-lg">
                            {sizes.length === 0 && colors.length === 0
                                ? "Add at least one size and one color to build the variant grid."
                                : sizes.length === 0
                                    ? "Add at least one size to build the variant grid."
                                    : "Add at least one color to build the variant grid."}
                        </p>
                    )}
                </div>
            </TooltipProvider>
        );
    }
);

export default VariantMatrix;