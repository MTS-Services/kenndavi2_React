import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';


const logo = "/assets/images/Layer_1 (2).png";


export function Logo(  ) {

    return (
        <div className="hidden bg-[var(--bg-animation)] p-4 flex justify-between items-center border-b border-gray-200">
            <div className="w-8">
            <img src={logo} alt="Logo" className="max-w-full" />
            </div>
            <button id="menuBtn" className="text-red-600 text-2xl">
            <i className="fas fa-bars" />
            </button>
      </div>
    );
}



