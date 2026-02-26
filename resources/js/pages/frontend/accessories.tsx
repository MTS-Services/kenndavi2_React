import FrontendLayout from '@/layouts/frontend-layout';
import React from 'react'

const accessories = () => {
  return (
    <FrontendLayout>
       <div className="bg-[#FDF7F7] font-sans text-gray-900 overflow-x-hidden">
  <section className="py-12">
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Large Image */}
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <img
            src="assets/images/Rectangle 16 (3).png"
            alt="Brown Leather Belt"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Middle Column (2 Stacked Images) */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded shadow-sm overflow-hidden">
            <img
              src="assets/images/Rectangle 18 (4).png"
              alt="Gift Box Belt"
              className="w-full h-[520px] object-cover"
            />
          </div>
          <div className="bg-white rounded shadow-sm overflow-hidden">
            <img
              src="assets/images/Frame 98 (3).png"
              alt="Belt on Jeans"
              className="w-full h-[520px] object-cover"
            />
          </div>
        </div>
        {/* Right Large Image */}
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <img
            src="assets/images/Rectangle 15 (3).png"
            alt="Man Wearing Belt"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
  <section className="flex items-center justify-center p-10">
    <div className="container mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left */}
      <div className="lg:col-span-2 h-[650px]">
        <div className="rounded overflow-hidden h-full">
          <img
            src="assets/images/Rectangle 16 (4).png"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Right */}
      <div className="flex flex-col gap-6 h-[650px]">
        <div className="rounded overflow-hidden flex-1">
          <img
            src="assets/images/Rectangle 18 (5).png"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="rounded overflow-hidden flex-1">
          <img
            src="assets/images/Frame 98 (4).png"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
  <section className="flex items-center justify-center p-10">
    <div className="container mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left */}
      <div className="h-[700px] rounded overflow-hidden">
        <img
          src="assets/images/Rectangle 16 (5).png"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Middle */}
      <div className="flex flex-col gap-6 h-[700px]">
        <div className="flex-1 rounded overflow-hidden">
          <img
            src="assets/images/Rectangle 18 (6).png"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 rounded overflow-hidden">
          <img
            src="assets/images/Frame 98 (5).png"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Right */}
      <div className="h-[700px] rounded overflow-hidden">
        <img
          src="assets/images/Rectangle 15 (4).png"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </section>
  <div className="flex justify-center items-center gap-4 my-8">
    <button className="border border-[#C1272D] px-6 py-3 text-[#C1272D] font-medium  transition-colors rounded-md">
      Back
    </button>
    <p className="text-center text-[#ffffff] text-lg font-medium cursor-pointer transition-colors bg-[#C1272D] px-6 py-3 rounded-md">
      Load More
    </p>
  </div>
</div>

    </FrontendLayout>
  )
}

export default accessories