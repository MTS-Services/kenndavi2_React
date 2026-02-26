import AppLogo from '@/components/app-logo';
import { Link } from '@inertiajs/react';
import logo from "./assets/Layer_1.png";
export function FrontendFooter() {
    return (
          <section className="bg-[#FDF7F7] font-sans text-gray-900 overflow-x-hidden">

          <footer className="bg-[#f3ecea] px-6 py-12 text-[#1a1a1a]">
          <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4">
              
              <div className="flex flex-col items-center md:items-start space-y-6">
              <div className="text-center md:text-left">
                  <img src="/assets/images/Layer_1.png" alt="logo" />
              </div>
              
              <div className="flex space-x-2">
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded bg-[#e8e0de] hover:bg-[#ddd4d1] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                  </a>
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded bg-[#e8e0de] hover:bg-[#ddd4d1] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded bg-[#e8e0de] hover:bg-[#ddd4d1] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </a>
              </div>
              </div>

              <div className="flex flex-col space-y-4">
              <a href="#" className="hover:underline underline-offset-4">Home</a>
              <a href="#" className="hover:underline underline-offset-4">About</a>
              <a href="#" className="hover:underline underline-offset-4">Support</a>
              </div>

              <div className="flex flex-col space-y-4">
              <a href="#" className="hover:underline underline-offset-4">Shipping & returns</a>
              <a href="#" className="hover:underline underline-offset-4">Privacy policy</a>
              <a href="#" className="hover:underline underline-offset-4">Terms & conditions</a>
              </div>

              <div className="flex flex-col space-y-4">
              <h3 className="font-semibold font-['Alumni_Sans'] text-2xl">Join for Exclusive</h3>
              <form className="flex flex-col sm:flex-row gap-2">
                  <input 
                  type="email" 
                  placeholder="Enter you email" 
                  className="flex-1 border border-gray-400 bg-transparent px-12 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B32B2B] rounded-md"
                  />
                  <button className="bg-[#B32B2B] px-6 py-3 text-white font-medium hover:bg-[#a02428] transition-colors rounded-md">
                  Subscribe
                  </button>
              </form>
              </div>

          </div>
          </footer>

          </section>
    );
}