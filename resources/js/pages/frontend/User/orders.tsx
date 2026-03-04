import { Head, router, useForm } from '@inertiajs/react';
import FrontendLayout from '@/layouts/frontend-layout';

export default function UserDashboard() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // This should hit a controller that sends the OTP and redirects to 'enter-code'
        post(route('login.send-code')); 
    };


    return (
        <FrontendLayout>
            <div>
                <div className="bg-[var(--bg-animation)] font-sans text-gray-900 overflow-x-hidden">
                <nav className="container mx-auto mt-10 relative z-50 flex items-center justify-between bg-[var(--bg-grayslight)] px-6 py-5 md:px-12">
                    <div className="flex items-center gap-2">
                    <img src="/assets/images/Rectangle 4343 (1).png" alt="Logo" className="h-10 w-auto" />
                    </div>
                    <ul className="hidden md:flex space-x-10 text-sm font-semibold tracking-wider font-['Libre_Franklin']">
                    <li>
                        <a href="#" className="text-red-600">
                        Order
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-red-600 transition">
                        Profile
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-red-600 transition">
                        Settings
                        </a>
                    </li>
                    </ul>
                    <div className="flex items-center gap-3 md:gap-6">
                    <div className="relative hidden sm:flex items-center gap-2 rounded bg-black px-4 py-2.5">
                        <i className="fa-solid fa-magnifying-glass text-xs text-gray-400" />
                        <input
                        type="text"
                        placeholder="Search"
                        className="w-20 md:w-32 bg-transparent text-xs text-white outline-none placeholder:text-gray-500"
                        />
                    </div>
                    <button className="text-lg">
                        <i className="fa-solid fa-cart-shopping" />
                    </button>
                    <button className="text-lg">
                        <i className="fa-regular fa-circle-user" />
                    </button>
                    <button
                        className="md:hidden text-2xl"
                        onClick={() => {
                        const menu = document.getElementById('mobile-menu');
                        if (menu) {
                            menu.classList.toggle('hidden');
                        }
                        }}
                    >
                        <i className="fa-solid fa-bars" />
                    </button>
                    </div>
                    <div
                    id="mobile-menu"
                    className="absolute left-0 top-full hidden w-full bg-[var(--bg-grayslight)] border-t border-gray-200 p-6 md:hidden"
                    >
                    <ul className="flex flex-col space-y-4 text-sm font-semibold uppercase tracking-wider font-['Libre_Franklin']">
                        <li>
                        <a href="#" className="block text-red-600">
                            Order
                        </a>
                        </li>
                        <li>
                        <a href="#" className="block">
                            Profile
                        </a>
                        </li>
                        <li>
                        <a href="#" className="block">
                            Settings
                        </a>
                        </li>
                        <li className="pt-4 border-t border-gray-300">
                        <div className="flex items-center gap-2 rounded bg-black px-4 py-2">
                            <i className="fa-solid fa-magnifying-glass text-xs text-gray-400" />
                            <input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-transparent text-xs text-white outline-none"
                            />
                        </div>
                        </li>
                    </ul>
                    </div>
                </nav>
                <div className="min-h-screen bg-[var(--bg-fade)] p-4 md:p-10 font-sans text-gray-900">
                    <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-[var(--bg-gray0)] p-6 rounded-sm flex flex-col md:flex-row gap-6 relative">
                        <div className="w-full md:w-48 aspect-square bg-gray-200 overflow-hidden rounded-sm">
                        <img
                            src="/assets/images/Rectangle 4343 (1).png"
                            alt="Broon Hoodie"
                            className="w-full h-full object-cover"
                        />
                        </div>
                        <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm text-gray-600">
                            Order ID: <span className="text-black">#ord-001</span>
                            </p>
                            <span className="bg-red-50 text-red-600 px-3 py-1 rounded-sm text-xs font-bold uppercase font-['Libre_Franklin']">
                            Pending
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 font-['Libre_Franklin']">
                            Broon Hoodie
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4 max-w-lg font-['Libre_Franklin']">
                            A premium, smooth hoodie crafted with the perfect balance of comfort
                            and street style. Ideal for everyday wear—making every look
                            effortlessly fresh.
                        </p>
                        <p className="text-xl font-bold mb-6 font-['Libre_Franklin']">$199</p>
                        <button className="border border-red-200 text-red-600 px-6 py-2 rounded-sm text-sm hover:bg-red-50 transition-colors">
                            Cancel Order
                        </button>
                        </div>
                    </div>
                    <div className="bg-[var(--bg-gray0)] p-6 rounded-sm flex flex-col md:flex-row gap-6 relative">
                        <div className="w-full md:w-48 aspect-square bg-gray-200 overflow-hidden rounded-sm">
                        <img
                            src="/assets/images/Rectangle 4343 (1).png"
                            alt="Broon Hoodie"
                            className="w-full h-full object-cover"
                        />
                        </div>
                        <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm text-gray-600">
                            Order ID: <span className="text-black">#ord-001</span>
                            </p>
                            <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-sm text-xs font-bold uppercase font-['Libre_Franklin']">
                            Packed
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 font-['Libre_Franklin']">
                            Broon Hoodie
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4 max-w-lg font-['Libre_Franklin']">
                            A premium, smooth hoodie crafted with the perfect balance of comfort
                            and street style.
                        </p>
                        <p className="text-xl font-bold mb-6 font-['Libre_Franklin']">$199</p>
                        <button className="border border-red-200 text-red-600 px-6 py-2 rounded-sm text-sm hover:bg-red-50 transition-colors">
                            Cancel Order
                        </button>
                        </div>
                    </div>
                    <div className="bg-[var(--bg-gray0)] p-6 rounded-sm flex flex-col md:flex-row gap-6 relative">
                        <div className="w-full md:w-48 aspect-square bg-gray-200 overflow-hidden rounded-sm">
                        <img
                            src="/assets/images/Rectangle 4343 (1).png"
                            alt="Broon Hoodie"
                            className="w-full h-full object-cover"
                        />
                        </div>
                        <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm text-gray-600">
                            Order ID: <span className="text-black">#ord-001</span>
                            </p>
                            <span className="bg-green-50 text-green-600 px-3 py-1 rounded-sm text-xs font-bold uppercase font-['Libre_Franklin']">
                            Delivered
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 font-['Libre_Franklin']">
                            Broon Hoodie
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4 max-w-lg font-['Libre_Franklin']">
                            A premium, smooth hoodie crafted with the perfect balance of comfort
                            and street style.
                        </p>
                        <p className="text-xl font-bold mb-6 font-['Libre_Franklin']">$199</p>
                        <button onClick={() => router.get('/orders2')} className="bg-bg-red text-white px-6 py-2 rounded-sm text-sm hover:bg-red-800 transition-colors font-['Libre_Franklin']">
                            Write A Review
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
                </div>

            </div>
        </FrontendLayout>
    );
}