import { Head, router } from '@inertiajs/react';
import React, { useEffect, useMemo, useState } from 'react';

import FrontendLayout from '@/layouts/frontend-layout';

interface GalleryItemProps {
    src: string;
    alt: string;
    title: string;
    colSpan?: string;
    height?: string;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ src, alt, title, colSpan = "md:col-span-1", height = "h-[850px]" }) => {
  return (
    <div className={`${colSpan} ${height} relative overflow-hidden rounded-md group cursor-pointer bg-gray-200`}>
      {/* Background Image with Zoom Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center w-full h-full transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
        style={{ backgroundImage: `url('${src}')` }}
        role="img"
        aria-label={alt}
      >
        {/* Dynamic Overlay */}
        <div className="absolute inset-0 transition-all duration-700 ease-out from-black/10 via-black/15 to-transparent opacity-0 group-hover:opacity-100"></div>
        <div className="absolute inset-0 transition-colors duration-500 backdrop-brightness-100 group-hover:backdrop-brightness-90"></div>
      </div>

      {/* Content Container (Slide up and Fade in) */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-white px-4 transition-all duration-700 ease-out translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">

        <h3 className="mb-4 text-xl md:text-2xl font-[Alumni_Sans] tracking-widest text-center uppercase">
          {title}
        </h3>

        {/* Decorative Line */}
        <div className="mb-4 h-12 w-px bg-white/50 transition-all duration-700 delay-100 scale-y-0 group-hover:scale-y-100 origin-top"></div>

        {/* The Button */}
        <button onClick={() => router.get('/productdetails')} className="bg-[var(--bg-red)] px-10 py-4 text-sm md:text-base font-medium transition-all duration-700 delay-200 ease-out opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 rounded hover:bg-red-800 shadow-xl relative overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
          <span className="relative z-10 text-white">View Details</span>
        </button>
      </div>

      {/* Border Glow */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/10 rounded-md transition-all duration-500 pointer-events-none"></div>
    </div>
  );
};

type Option = {
  value: string;
  label: string;
};

type Props = {
  categories?: Option[];
  // Map: { [parentCategorySlug]: [{ value, label }, ...] }
  subcategories?: Record<string, Option[]>;
  selectedCategory?: string;
  selectedSubcategory?: string;
  products?: Array<{
    id: number;
    title: string;
    slug: string;
    price: string | number;
    discount: string | number | null;
    image_url: string | null;
  }>;
  currentPage?: number;
  totalPages?: number;
};

const ProductGallery: React.FC<Props> = ({
  categories = [],
  subcategories = {},
  selectedCategory = 'all',
  selectedSubcategory = 'all',
  products = [],
  currentPage = 1,
  totalPages = 1,
}) => {
  const [category, setCategory] = useState(selectedCategory);
  const [subcategory, setSubcategory] = useState(selectedSubcategory);

  useEffect(() => {
    setCategory(selectedCategory ?? 'all');
    setSubcategory(selectedSubcategory ?? 'all');
  }, [selectedCategory, selectedSubcategory]);

  const subcategoryOptions = category === 'all' ? [] : (subcategories[category] ?? []);

  const resolveImageUrl = (url: string | null) => {
    if (!url) return '/assets/images/bg.png';
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return url;
    return `/${url}`;
  };

  const navigateWithFilters = (nextCategory: string, nextSubcategory: string) => {
    const query: Record<string, string> = {};
    if (nextCategory !== 'all') query.category = nextCategory;
    if (nextSubcategory !== 'all') query.subcategory = nextSubcategory;
    query.page = '1';
    router.get('/hoodies-women', query);
  };

  const navigateWithFiltersAndPage = (nextCategory: string, nextSubcategory: string, nextPage: number) => {
    const query: Record<string, string> = {};
    if (nextCategory !== 'all') query.category = nextCategory;
    if (nextSubcategory !== 'all') query.subcategory = nextSubcategory;
    query.page = String(nextPage);
    router.get('/hoodies-women', query);
  };

  const productAt = (index: number) => products[index] ?? null;

  const isDefaultFilters = category === 'all' && subcategory === 'all';

  type Slot = {
    src: string;
    alt: string;
    title: string;
    colSpan?: string;
    height?: string;
  };

  const defaultSlots: Slot[] = [
    { src: '/assets/images/Rectangle 15 (1).png', alt: 'Tracksuit Back', title: 'Tracksuit Back' },
    { src: '/assets/images/Rectangle 16 (1).png', alt: 'Tracksuit Front', title: 'Tracksuit Front', colSpan: 'md:col-span-2' },
    { src: '/assets/images/Rectangle 17 (1).png', alt: 'Aces Box', title: 'Aces Box', height: 'flex-1 min-h-[192px]' },
    { src: '/assets/images/Frame 98.png', alt: 'Hoodie Flat', title: 'Hoodie Flat', height: 'flex-1 min-h-[192px]' },
  ];

  const slotData = (index: number): Slot | null => {
    const slot = defaultSlots[index];
    const p = productAt(index);

    if (!slot) return null;
    if (isDefaultFilters) return slot;
    if (!p) return slot;

    return {
      src: resolveImageUrl(p.image_url),
      alt: p.title,
      title: p.title,
      colSpan: slot.colSpan,
      height: slot.height,
    };
  };

  return (
    <div className="relative bg-transparent font-sans text-white overflow-x-hidden">
      <div className="absolute inset-0 bg-black/20 -z-10" />

      {/* --- FILTER HEADER --- */}
      <section className="container mx-auto px-4 pt-10 pb-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-4 items-end">
          <div>
            <label className="block text-xl font-semibold tracking-wide text-white/80 mb-2 font-['Alumni_Sans']">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(event) => {
                  const nextCategory = event.target.value;
                  setCategory(nextCategory);
                  setSubcategory('all');
                  navigateWithFilters(nextCategory, 'all');
                }}
                className="w-full rounded-lg border border-white/10 bg-white/90 py-3 pl-4 pr-10 text-sm font-medium text-gray-900 shadow-sm outline-none transition focus:border-white focus:ring-2 focus:ring-white/20"
              >
                <option value="all">All</option>
                {categories.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xl font-semibold tracking-wide text-white/80 mb-2 font-['Alumni_Sans']">Subcategory</label>
            <div className="relative">
              <select
                value={subcategory}
                onChange={(event) => {
                  const nextSubcategory = event.target.value;
                  setSubcategory(nextSubcategory);
                  navigateWithFilters(category, nextSubcategory);
                }}
                className="w-full rounded-lg border border-white/10 bg-white/90 py-3 pl-4 pr-10 text-sm font-medium text-gray-900 shadow-sm outline-none transition focus:border-white focus:ring-2 focus:ring-white/20"
              >
                <option value="all">All</option>
                {subcategoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between lg:justify-end">
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setSubcategory('all');
                navigateWithFilters('all', 'all');
              }}
              className="inline-flex items-center justify-center rounded bg-red-700 px-5 py-4 text-sm font-semibold text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      {!isDefaultFilters && products.length === 0 ? (
        <div className="text-white/80 text-center py-10 relative z-10">
          No products found for this filter.
        </div>
      ) : (
        <div className="space-y-8 relative z-10">
          {/* SECTION 1 */}
          <section className="p-4 md:p-8 container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                {(() => {
                  const s = slotData(0);
                  if (!s) return null;
                  return <GalleryItem src={s.src} alt={s.alt} title={s.title} />;
                })()}
              </div>

              {(() => {
                const s = slotData(1);
                if (!s) return null;
                return (
                  <GalleryItem
                    src={s.src}
                    alt={s.alt}
                    title={s.title}
                    colSpan={s.colSpan ?? "md:col-span-2"}
                  />
                );
              })()}

              <div className="md:col-span-1 flex flex-col gap-4">
                {(() => {
                  const s = slotData(2);
                  if (!s) return null;
                  return (
                    <GalleryItem
                      src={s.src}
                      alt={s.alt}
                      title={s.title}
                      height={s.height ?? "flex-1 min-h-[192px]"}
                    />
                  );
                })()}

                {(() => {
                  const s = slotData(3);
                  if (!s) return null;
                  return (
                    <GalleryItem
                      src={s.src}
                      alt={s.alt}
                      title={s.title}
                      height={s.height ?? "flex-1 min-h-[192px]"}
                    />
                  );
                })()}
              </div>
            </div>
          </section>

          {/* Footer Buttons / Pagination */}
          <div className="flex justify-center items-center gap-4 my-12">
            <button className="border border-red-700 px-8 py-3 text-red-700 font-medium transition-all hover:bg-red-50 rounded-md">
              Back
            </button>

            {totalPages > 1 && currentPage < totalPages ? (
              <button
                type="button"
                onClick={() => navigateWithFiltersAndPage(category, subcategory, currentPage + 1)}
                className="text-center text-white text-lg font-medium cursor-pointer transition-all bg-red-700 hover:bg-red-800 px-8 py-3 rounded-md shadow-lg active:scale-95"
              >
                Load More
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="text-center text-white text-lg font-medium cursor-not-allowed transition-all bg-gray-700 px-8 py-3 rounded-md shadow-lg active:scale-95"
              >
                End
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function HoodiesWomen(props: Props) {
    return (
        <FrontendLayout>
            <Head title="Hoodies Women" />
            <ProductGallery {...props} />
        </FrontendLayout>
    );
}
