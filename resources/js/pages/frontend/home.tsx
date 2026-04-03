import { details as productDetailsRoute } from '@/routes/products';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';

import FrontendLayout from '@/layouts/frontend-layout';

const heroSlides = [
    {
        id: 0,
        title: 'Aces In DA Hole was created to celebrate a brotherhood built over 30+ years, not by blood, but by loyalty. Through every setback, hardship, and triumph, we\'ve stood together, uplifted each other, and grown stronger as one. Our brand reflects that same standard, crafted to stand the test of time, just like real brotherhood does. Aces In DA Hole - "Built on Loyalty Designed to Last".',
        primaryCta: 'Shop Now',
        // secondaryCta: 'Learn More',
        image: '/assets/images/heads.png',
    },
    {
        id: 1,
        title: 'Aces In DA Hole was created to celebrate a brotherhood built over 30+ years, not by blood, but by loyalty. Through every setback, hardship, and triumph, we\'ve stood together, uplifted each other, and grown stronger as one. Our brand reflects that same standard, crafted to stand the test of time, just like real brotherhood does. Aces In DA Hole - "Built on Loyalty Designed to Last".',
        primaryCta: 'Shop Now',
        // secondaryCta: 'View Collection',
        image: '/assets/images/Adobe Express - file.png',
    },
    {
        id: 2,
        title: 'Aces In DA Hole was created to celebrate a brotherhood built over 30+ years, not by blood, but by loyalty. Through every setback, hardship, and triumph, we\'ve stood together, uplifted each other, and grown stronger as one. Our brand reflects that same standard, crafted to stand the test of time, just like real brotherhood does. Aces In DA Hole - "Built on Loyalty Designed to Last".',
        primaryCta: 'Shop Now',
        // secondaryCta: 'Discover More',
        image: '/assets/images/Adobe Express - file (1).png',
    },
    {
        id: 3,
        title: 'Aces In DA Hole was created to celebrate a brotherhood built over 30+ years, not by blood, but by loyalty. Through every setback, hardship, and triumph, we\'ve stood together, uplifted each other, and grown stronger as one. Our brand reflects that same standard, crafted to stand the test of time, just like real brotherhood does. Aces In DA Hole - "Built on Loyalty Designed to Last".',
        primaryCta: 'Shop Now',
        secondaryCta: '',
        image: '/assets/images/rechangele.png',
    },
];

const featuredFallbackImage = '/assets/images/Rectangle 9.jpg';

interface ProductPrimaryImage {
    id: number;
    url: string;
    alt_text: string | null;
}

interface FeaturedProduct {
    id: number;
    title: string;
    slug: string;
    price: string;
    primary_image: ProductPrimaryImage | null;
}

function formatUsd(price: string): string {
    const n = Number.parseFloat(price);
    if (!Number.isFinite(n)) {
        return price;
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(n);
}

export default function Home({
    products = [],
}: {
    products?: FeaturedProduct[];
}) {
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

    const totalHeroSlides = heroSlides.length;

    const showPreviousHero = () => {
        setCurrentHeroIndex(
            (prev) => (prev - 1 + totalHeroSlides) % totalHeroSlides,
        );
    };

    const showNextHero = () => {
        setCurrentHeroIndex((prev) => (prev + 1) % totalHeroSlides);
    };

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setCurrentHeroIndex((prev) => (prev + 1) % totalHeroSlides);
        }, 5000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [currentHeroIndex]);

    return (
        <FrontendLayout>
            <Head title="Home Page" />
            <section className="overflow-x-hidden bg-transparent font-sans text-white">
                <div className="absolute inset-0 z-0 bg-sidebar/60"></div>
                <div className="relative container mx-auto flex min-h-[90vh] flex-col items-center overflow-hidden px-6 pt-8 md:px-12 lg:h-[80vh] lg:flex-row lg:px-24 lg:pt-20">
                    <div className="relative z-20 max-w-3xl text-center lg:text-left">
                        <h1 className="mb-10 font-['Alumni_Sans'] text-3xl leading-[1.1] font-semibold md:text-4xl lg:text-5xl">
                            {heroSlides[currentHeroIndex].title}
                        </h1>

                        <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                            <button
                                onClick={() => router.get('/sweatsuitsmen')}
                                className="w-full rounded bg-[var(--bg-red)] px-10 py-3.5 font-['Libre_Franklin'] text-sm font-medium text-white transition hover:bg-black sm:w-auto"
                            >
                                {heroSlides[currentHeroIndex].primaryCta}
                            </button>
                            {heroSlides[currentHeroIndex].secondaryCta && (
                                <button className="w-full rounded-md border border-[var(--bg-red)] px-10 py-3.5 font-['Libre_Franklin'] text-sm font-medium text-[var(--bg-red)] transition hover:bg-[var(--bg-red)] hover:text-white sm:w-auto">
                                    {heroSlides[currentHeroIndex].secondaryCta}
                                </button>
                            )}
                        </div>
                    </div>

                    <div
                        className="relative top-0 right-0 mt-0 flex h-[50vh] w-full items-center justify-center lg:absolute lg:right-[-10%] lg:mt-12 lg:h-full lg:w-2/3"
                        style={{
                            backgroundImage:
                                'url("/assets/images/Group 1.png")',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 translate-x-20 scale-75 transform rounded-full opacity-10 blur-[120px]"></div>
                        <img
                            src={heroSlides[currentHeroIndex].image}
                            alt="Hero"
                            className="relative z-10 h-[80%] object-contain drop-shadow-2xl lg:h-[90%]"
                        />
                    </div>

                    <button
                        onClick={showPreviousHero}
                        className="absolute top-1/2 left-4 z-30 h-12 w-12 -translate-y-1/2 items-center justify-center rounded-md bg-[var(--bg-red)] text-white"
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    <button
                        onClick={showNextHero}
                        className="absolute top-1/2 right-4 z-30 h-12 w-12 -translate-y-1/2 items-center justify-center rounded-md bg-[var(--bg-red)] text-white"
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>

                <div className="relative z-10 overflow-hidden bg-[var(--bg-red)] py-3 whitespace-nowrap text-white">
                    <Marquee className="text-[10px] font-bold tracking-widest uppercase">
                        Free Standard Delivery & 30-Day Free Returns | Free
                        Standard Delivery & 30-Day Free Returns | Free Standard
                        Delivery & 30-Day Free Returns | Free Standard Delivery
                        & 30-Day Free Returns | Free Standard Delivery & 30-Day
                        Free Returns | Free Standard Delivery & 30-Day Free
                        Returns |
                    </Marquee>
                </div>
                <div className="container mx-auto text-black">
                    <section className="relative z-10 px-10 py-6 lg:px-24 lg:py-20">
                        <div className="mb-10 flex items-center justify-between">
                            <h2 className="font-['Alumni_Sans'] text-3xl font-semibold tracking-tight text-gray-100 lg:text-5xl">
                                Featured Products
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            {products.length === 0 ? (
                                <p className="col-span-2 text-center font-['Libre_Franklin'] text-sm text-gray-400">
                                    No featured products right now. Check back
                                    soon.
                                </p>
                            ) : (
                                products.map((product) => {
                                    const imageSrc =
                                        product.primary_image?.url ??
                                        featuredFallbackImage;
                                    const alt =
                                        product.primary_image?.alt_text ??
                                        product.title;
                                    const bg = `url("${imageSrc.replace(/"/g, '\\"')}")`;

                                    return (
                                        <div
                                            key={product.id}
                                            className="group relative h-[174px] w-full cursor-pointer overflow-hidden rounded-md lg:h-[820px]"
                                        >
                                            <div
                                                className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                                                style={{
                                                    backgroundImage: bg,
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent transition-all duration-700 group-hover:from-black/40 group-hover:via-black/20 group-hover:to-transparent"></div>
                                                <div className="absolute inset-0 backdrop-brightness-100 transition-colors duration-500 group-hover:backdrop-brightness-90"></div>
                                            </div>

                                            <div className="relative z-10 flex h-full translate-y-4 flex-col items-center justify-center px-4 text-white opacity-90 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                                                <h3 className="mb-2 translate-y-4 text-center font-[Alumni_Sans] text-xl tracking-wide opacity-0 transition-all delay-100 duration-700 group-hover:translate-y-0 group-hover:opacity-100 md:mb-4 md:text-2xl lg:text-3xl">
                                                    {product.title}
                                                </h3>
                                                <p className="mb-4 translate-y-4 font-['Libre_Franklin'] text-sm font-medium opacity-0 transition-all delay-150 duration-700 group-hover:translate-y-0 group-hover:opacity-100 md:text-base">
                                                    {formatUsd(product.price)}
                                                </p>

                                                <div className="mb-4 h-10 w-px origin-top scale-y-0 bg-white/50 transition-all delay-200 duration-700 group-hover:scale-y-100 lg:mb-8 lg:h-24"></div>

                                                <Link
                                                    type="button"
                                                    href={productDetailsRoute(
                                                        product.id,
                                                    )}
                                                    className="ease-elastic pointer-events-none relative max-w-[200px] scale-75 rotate-[-5deg] overflow-hidden bg-[var(--bg-red)] px-10 py-3 text-base font-medium opacity-0 shadow-lg transition-all delay-300 duration-700 group-hover:pointer-events-auto group-hover:scale-100 group-hover:rotate-0 group-hover:opacity-100 hover:bg-[var(--bg-red-dark)] hover:shadow-xl active:scale-95 sm:w-auto md:py-4 md:text-lg lg:w-full"
                                                >
                                                    <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]"></span>
                                                    <span className="relative z-10">
                                                        View Details
                                                    </span>
                                                </Link>
                                            </div>

                                            <div className="pointer-events-none absolute inset-0 rounded-md border-2 border-transparent transition-all duration-500 group-hover:border-white/20"></div>
                                            <span className="sr-only">
                                                {alt}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>
                </div>
            </section>
        </FrontendLayout>
    );
}
