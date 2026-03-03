import { Head, router } from '@inertiajs/react';
import UserLayout from '@/layouts/user-layout';

export default function UserHome() {
    return (
        <UserLayout>
            <Head title="Dashboard" />
           <div className="bg-[#FDF7F7] font-sans text-gray-900 overflow-x-hidden">
            <section className=" bg-[#fdf8f7] p-6 md:p-12 font-sans text-[#1a1a1a]">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-xl font-bold mb-6 font-['Alumni_Sans']">Profile</h1>
                <div className="space-y-4">
                  <div className="bg-[#f4ecea] p-8 rounded-sm">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm font-['Libre_Franklin']">
                          Name
                        </span>
                        <button onClick={() => router.get('/Editprofile')} className="text-gray-400 hover:text-black transition-colors">
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
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-['Libre_Franklin']">
                          Number
                        </p>
                        <p className="font-medium">06541451</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-['Libre_Franklin']">
                          Email
                        </p>
                        <p className="font-medium font-['Libre_Franklin']">
                          mdshakibalhasan62@gmail.com
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#f4ecea] p-8 rounded-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-gray-500 text-sm font-['Libre_Franklin']">
                        Addresses
                      </span>
                      <button className="text-gray-400 hover:text-black transition-colors">
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-gray-500 text-sm font-['Libre_Franklin']">
                          Default address
                        </p>
                        <button onClick={() => router.get('/Editaddress')} className="text-gray-400 hover:text-black transition-colors">
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
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="font-normal font-['Libre_Franklin']">Bangladesh</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>


        </UserLayout>
    );
}

