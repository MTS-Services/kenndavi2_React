import { Head } from "@inertiajs/react";
import FrontendLayout from "@/layouts/frontend-layout";

export default function ProductDetails2() {
    return (
        <FrontendLayout>
            <Head title="Product Details" />
            <div className="bg-[var(--bg-animation)] font-sans text-gray-900 overflow-x-hidden">
            <div className="min-h-screen bg-[var(--bg-animation)] p-4 md:p-12 font-sans">
              <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
                <div className="flex-grow">
                  <h1 className="text-2xl font-bold mb-8 font-['Alumni_Sans']">
                    Shipping information
                  </h1>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-md font-bold mb-2 font-['Alumni_Sans']">
                          First name
                        </label>
                        <input
                          type="text"
                          placeholder="First name"
                          className="w-full p-3 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                        />
                      </div>
                      <div>
                        <label className="block text-md font-bold mb-2 font-['Alumni_Sans']">
                          Last name
                        </label>
                        <input
                          type="text"
                          placeholder="Last name"
                          className="w-full p-3 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-md font-bold mb-2 font-['Alumni_Sans']">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="jackson.graham@example.com"
                          className="w-full p-3 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                        />
                      </div>
                      <div>
                        <label className="block text-md font-bold mb-2 font-['Alumni_Sans']">
                          Phone number
                        </label>
                        <input
                          type="tel"
                          placeholder="(406) 555-0120"
                          className="w-full p-3 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-md font-bold mb-2 font-['Alumni_Sans']">
                          Region/State
                        </label>
                        <input
                          type="text"
                          placeholder="Antofagasta"
                          className="w-full p-3 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                        />
                      </div>
                      <div>
                        <label className="block text-md font-bold mb-2 font-['Alumni_Sans']">
                          City
                        </label>
                        <input
                          type="text"
                          placeholder="Pembroke Pines"
                          className="w-full p-3 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                        />
                      </div>
                      <div>
                        <label className="block text-md font-bold mb-2 font-['Alumni_Sans']">
                          Zip code
                        </label>
                        <input
                          type="text"
                          placeholder="97133"
                          className="w-full p-3 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-md font-bold mb-2 font-['Alumni_Sans']">
                        Address
                      </label>
                      <input
                        type="text"
                        placeholder="8558 Green Rd."
                        className="w-full p-3 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="save-address"
                        className="w-5 h-5 accent-red-700 border-gray-300 rounded"
                      />
                      <label htmlFor="save-address" className="text-sm text-gray-700">
                        Save shipping address into default address
                      </label>
                    </div>
                  </form>
                </div>
                <div className="w-full lg:w-[380px] bg-[var(--bg-gray0)] p-6 md:p-8 rounded-sm self-start">
                  <h2 className="text-lg font-bold mb-6 font-['Libre_Franklin']">
                    Order summary
                  </h2>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14  flex items-center justify-center rounded-md shrink-0">
                        <img
                          src="assets/images/Rectangle 25 (3).png"
                          alt="Hoodie"
                          className="h-10 object-contain"
                        />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold">Broon hoodie</p>
                        <p className="text-gray-600">
                          1 x <span className="font-bold text-black">$70</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14  flex items-center justify-center rounded-md shrink-0">
                        <img
                          src="assets/images/Frame 2147226352 (1).png"
                          alt="Pants"
                          className="h-10 object-contain"
                        />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold">Black pant</p>
                        <p className="text-gray-600">
                          1 x <span className="font-bold text-black">$70</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14  flex items-center justify-center rounded-md shrink-0">
                        <img
                          src="assets/images/Rectangle 28 (1).png"
                          alt="Shoes"
                          className="h-10 object-contain"
                        />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold">Black shoe</p>
                        <p className="text-gray-600">
                          1 x <span className="font-bold text-black">$70</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm border-t border-gray-300 pt-6 mb-8">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sub-total</span>
                      <span className="font-bold">$210</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-300 pb-3">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-bold">$00</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="font-bold font-['Libre_Franklin']">Total</span>
                      <span className="font-bold text-base">$210</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button className="w-full bg-[var(--bg-red)] text-white py-3 font-medium rounded-sm flex items-center justify-center gap-2 hover:bg-red-800 transition-colors">
                      Place Order
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </button>
                    <button className="w-full border border-[var(--bg-red)] text-[var(--bg-red)] py-3 font-medium rounded-sm hover:bg-red-50 transition-colors">
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </FrontendLayout>   
    );



}
