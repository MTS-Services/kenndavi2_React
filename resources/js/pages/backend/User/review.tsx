import { Head, router } from '@inertiajs/react';

import UserLayout from '@/layouts/user-layout';

export default function UserHome() {
    return (
        <UserLayout>
            <Head title="Dashboard" />
          <div className="bg-bg-animation font-sans text-gray-900 overflow-x-hidden">
  
            <div className=" bg-bg-fade flex items-center justify-center font-sans p-4">
                <div className="bg-[var(--bg-gray0)] w-full max-w-5xl p-8 md:p-12 rounded-sm shadow-sm text-gray-900">
                <div className="mb-8">
                    <h2 className="text-xl font-bold font-['Alumni_Sans']">
                    How was your experience?
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-['Alumni_Sans']">
                    Your review helps other customers
                    </p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); /* TODO: Implement review submission */ }} className="space-y-8">
                    <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 font-['Alumni_Sans']">
                        Rate Your Product
                    </label>
                    <div className="flex gap-2">
                        <svg
                        className="w-8 h-8 text-[var(--bg-yellows)] fill-current"
                        viewBox="0 0 20 20"
                        >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg
                        className="w-8 h-8 text-[var(--bg-yellows)] fill-current"
                        viewBox="0 0 20 20"
                        >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg
                        className="w-8 h-8 text-[var(--bg-yellows)] fill-current"
                        viewBox="0 0 20 20"
                        >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg
                        className="w-8 h-8 text-[var(--bg-yellows)] fill-current"
                        viewBox="0 0 20 20"
                        >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg
                        className="w-8 h-8 text-[var(--bg-yellows)] fill-current"
                        viewBox="0 0 20 20"
                        >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                    </div>
                    <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 font-['Alumni_Sans']">
                        Review
                    </label>
                    <textarea
                        placeholder="Write here"
                        rows={6}
                        className="w-full p-4 bg-white/50 border border-gray-100 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-400 resize-none"
                        defaultValue={""}
                    />
                    </div>
                    <button
                    type="submit"
                    className="bg-bg-red text-white px-10 py-3 font-medium rounded-md hover:bg-red-800 transition-colors font-['Alumni_Sans']"
                    >
                    Submit
                    </button>
                </form>
                </div>
            </div>
            </div>


        </UserLayout>
    );
}

