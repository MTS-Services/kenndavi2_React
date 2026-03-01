import { Head } from "@inertiajs/react";
import FrontendLayout from "@/layouts/frontend-layout";
 
// --- REUSABLE GRID ITEM COMPONENT ---
// This handles the high-end hover effect for all product boxes
function GridItem({ img, title, isLarge = false }: { img: string, title: string, isLarge?: boolean }) {
    return (
        <div className={`relative overflow-hidden rounded group cursor-pointer w-full ${isLarge ? 'h-[400px] lg:h-[850px]' : 'h-[192px] lg:h-[420px]'}`}>
            {/* Background Image with Zoom & Rotate Effect */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                style={{ backgroundImage: `url('${img}')` }}
            >
                {/* Dynamic Overlay */}
                <div className="absolute inset-0 transition-all duration-700 bg-gray-900/10 via-gray-900 to-transparent group-hover:from-gray-900 group-hover:via-gray-900/90 group-hover:to-transparent"></div>
                <div className="absolute inset-0 transition-colors duration-500 backdrop-brightness-100 group-hover:backdrop-brightness-90"></div>
            </div>

            {/* Content Container (Slides up on hover) */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-white px-4 transition-all duration-700 ease-out translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                
                {/* Title */}
                <h3 className="mb-2 md:mb-4 text-xl md:text-3xl font-['Alumni_Sans'] font-semibold tracking-wide text-center uppercase">
                    {title}
                </h3>

                {/* Decorative Line */}
                <div className="mb-4 h-10 lg:h-20 w-px bg-white/50 transition-all duration-700 delay-100 scale-y-0 group-hover:scale-y-100 origin-top"></div>

                {/* The Button */}
                <button className="bg-[var(--bg-primary)] px-10 py-4 text-base font-medium font-['Libre_Franklin'] transition-all duration-700 delay-200 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 rounded shadow-lg relative overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                    <span className="relative z-10">View Details</span>
                </button>
            </div>

            {/* Image border glow */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-md transition-all duration-500 pointer-events-none"></div>
        </div>
    );
}

export default function SweatsuitsMen() {
    return (
        <FrontendLayout>
            <Head title="Sweatsuits Men" />
            <div className="bg-[var(--bg-animason)] font-sans text-gray-900 overflow-x-hidden">
                
                {/* --- PRODUCT GRID SECTIONS --- */}
                <div className="space-y-8">
                    
                    {/* SECTION 1: Layout 1-2-1 */}
                    <section className="lg:py-12 py-6 container mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-1 flex flex-col gap-4">
                                <GridItem img="/assets/images/Rectangle 17.png" title="Aces Box" />
                                <GridItem img="/assets/images/Frame 98 (1).png" title="Hoodie Flat" />
                            </div>
                            <div className="md:col-span-2">
                                <GridItem img="/assets/images/Rectangle 16.png" title="Tracksuit Front" isLarge />
                            </div>
                            <div className="md:col-span-1">
                                <GridItem img="/assets/images/Rectangle 15.png" title="Tracksuit Back" isLarge />
                            </div>
                        </div>
                    </section>

                    {/* SECTION 2: Layout 1-2-1 */}
                    <section className="lg:py-12 py-6 container mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-1 flex flex-col gap-4">
                                <GridItem img="/assets/images/Rectangle 20 (1).png" title="Aces Box" />
                                <GridItem img="/assets/images/Frame 101 (1).png" title="Hoodie Flat" />
                            </div>
                            <div className="md:col-span-2">
                                <GridItem img="/assets/images/Rectangle 19 (1).png" title="Tracksuit Front" isLarge />
                            </div>
                            <div className="md:col-span-1">
                                <GridItem img="/assets/images/Rectangle 18 (1).png" title="Tracksuit Back" isLarge />
                            </div>
                        </div>
                    </section>

                    {/* SECTION 3: Layout 1-2-1 Reversed End */}
                    <section className="lg:py-12 py-6 container mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-1">
                                <GridItem img="/assets/images/Rectangle 21.png" title="Tracksuit Back" isLarge />
                            </div>
                            <div className="md:col-span-2">
                                <GridItem img="/assets/images/Frame 104 (1).png" title="Tracksuit Front" isLarge />
                            </div>
                            <div className="md:col-span-1 flex flex-col gap-4">
                                <GridItem img="/assets/images/Rectangle 23.png" title="Aces Box" />
                                <GridItem img="/assets/images/Frame 100 (2).png" title="Hoodie Flat" />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </FrontendLayout>
    );
}
