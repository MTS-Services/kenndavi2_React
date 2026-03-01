import FrontendLayout from '@/layouts/frontend-layout';
import { Head } from '@inertiajs/react';
import React from 'react';

const HomeWomen: React.FC = () => {
    return (
        <FrontendLayout>
        <div className="bg-[var(--bg-animation)] font-sans text-gray-900 overflow-x-hidden">

        <section className="p-4 md:p-8 container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1 bg-gray-100 overflow-hidden">
                <img
                src="assets/images/Rectangle 15 (1).png"
                alt="Tracksuit Back"
                className="w-full h-full object-cover"
                />
            </div>
            <div className="md:col-span-2 bg-gray-100 overflow-hidden">
                <img
                src="assets/images/Rectangle 16 (1).png"
                alt="Tracksuit Front"
                className="w-full h-full object-cover"
                />
            </div>
            <div className="md:col-span-1 flex flex-col gap-4">
                <div className="bg-gray-100 flex-1 overflow-hidden">
                <img
                    src="assets/images/Rectangle 17 (1).png"
                    alt="Aces Box"
                    className="w-full h-full object-cover"
                />
                </div>
                <div className="bg-gray-100 flex-1 overflow-hidden">
                <img
                    src="assets/images/Frame 98.png"
                    alt="Hoodie Flat"
                    className="w-full h-full object-cover"
                />
                </div>
            </div>
            </div>
        </section>
        <section className="p-4 md:p-8 container mx-auto ">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1 flex flex-col gap-4">
                <div className="bg-gray-100 flex-1 overflow-hidden">
                <img
                    src="assets/images/Rectangle 20.png"
                    alt="Aces Box"
                    className="w-full h-full object-cover"
                />
                </div>
                <div className="bg-gray-100 flex-1 overflow-hidden">
                <img
                    src="assets/images/Frame 101 (2).png"
                    alt="Hoodie Flat"
                    className="w-full h-full object-cover"
                />
                </div>
            </div>
            <div className="md:col-span-2 bg-gray-100 overflow-hidden">
                <img
                src="assets/images/Rectangle 19 (2).png"
                alt="Tracksuit Front"
                className="w-full h-full object-cover"
                />
            </div>
            <div className="md:col-span-1 bg-gray-100 overflow-hidden">
                <img
                src="assets/images/Rectangle 18 (2).png"
                alt="Tracksuit Back"
                className="w-full h-full object-cover"
                />
            </div>
            </div>
        </section>
        <section className="p-4 md:p-8 container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1 bg-gray-100 overflow-hidden">
                <img
                src="assets/images/Rectangle 21 (2).png"
                alt="Tracksuit Back"
                className="w-full h-full object-cover"
                />
            </div>
            <div className="md:col-span-2 bg-gray-100 overflow-hidden">
                <img
                src="assets/images/Frame 104 (2).png"
                alt="Tracksuit Front"
                className="w-full h-full object-cover"
                />
            </div>
            <div className="md:col-span-1 flex flex-col gap-4">
                <div className="bg-gray-100 flex-1 overflow-hidden">
                <img
                    src="assets/images/Rectangle 23.png"
                    alt="Aces Box"
                    className="w-full h-full object-cover"
                />
                </div>
                <div className="bg-gray-100 flex-1 overflow-hidden">
                <img
                    src="assets/images/Frame 100 (4).png"
                    alt="Hoodie Flat"
                    className="w-full h-full object-cover"
                />
                </div>
            </div>
            </div>
        </section>
        <div className="flex justify-center items-center gap-4 my-8">
            <button className="border border-red-700 px-6 py-3 text-[var(--text-primary)] font-medium  transition-colors rounded-md">
            Back
            </button>
            <p className="text-center text-white text-lg font-medium cursor-pointer transition-colors bg-[var(--bg-red)] px-6 py-3 rounded-md">
            Load More
            </p>
        </div>
    </div>
        </FrontendLayout>
    );
};

export default HomeWomen;