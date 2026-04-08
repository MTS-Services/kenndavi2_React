import { Head } from '@inertiajs/react';

import FrontendLayout from '@/layouts/frontend-layout';

export default function ReviewForm() {
    return (
        <FrontendLayout>
            <Head title="Write a review for - Product Name" />
            <section className="flex flex-1 items-center justify-center py-10">
                <div className="container mx-auto max-w-4xl">
                    <div className="w-full rounded-sm bg-[var(--bg-gray0)] p-8 text-gray-900 shadow-sm md:p-12">
                        <div className="mb-8">
                            <h2 className="font-['Alumni_Sans'] text-xl font-bold">
                                How was your experience?
                            </h2>
                            <p className="mt-1 font-['Alumni_Sans'] text-sm text-gray-500">
                                Your review helps other customers
                            </p>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault(); /* TODO: Implement review submission */
                            }}
                            className="space-y-8"
                        >
                            <div>
                                <label className="mb-2 block font-['Alumni_Sans'] text-xs font-bold tracking-wider uppercase">
                                    Rate Your Product
                                </label>
                                <div className="flex gap-2">
                                    <svg
                                        className="h-8 w-8 fill-current text-[var(--bg-yellows)]"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg
                                        className="h-8 w-8 fill-current text-[var(--bg-yellows)]"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg
                                        className="h-8 w-8 fill-current text-[var(--bg-yellows)]"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg
                                        className="h-8 w-8 fill-current text-[var(--bg-yellows)]"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg
                                        className="h-8 w-8 fill-current text-[var(--bg-yellows)]"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block font-['Alumni_Sans'] text-xs font-bold tracking-wider uppercase">
                                    Review
                                </label>
                                <textarea
                                    placeholder="Write here"
                                    rows={6}
                                    className="w-full resize-none rounded-sm border border-gray-100 bg-white/50 p-4 transition-all placeholder:text-gray-400 focus:ring-1 focus:ring-red-800 focus:outline-none"
                                    defaultValue={''}
                                />
                            </div>
                            <button
                                type="submit"
                                className="rounded-md bg-bg-red px-10 py-3 font-['Alumni_Sans'] font-medium text-white transition-colors hover:bg-red-800"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
