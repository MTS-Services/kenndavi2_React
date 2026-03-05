import * as React from 'react';
import { useState } from 'react';

export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

interface OrderStatusFilterProps {
    activeFilter: OrderStatus;
    onFilterChange: (status: OrderStatus) => void;
    countByStatus: Record<OrderStatus, number>;
}

const filterButtonClasses = (isActive: boolean) =>
    'flex items-center space-x-2 pb-4 md:pb-4 flex-shrink-0 transition-colors ' +
    (isActive ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700');

// Mobile specific classes to make it look like a list item
const mobileItemClasses = (isActive: boolean) =>
    `flex items-center justify-between w-full p-3 rounded-lg ${isActive ? 'bg-red-50 text-red-600' : 'text-gray-600'}`;

const badgeClasses = (isActive: boolean) =>
    'text-[10px] px-2 py-1 rounded-full ' +
    (isActive ? 'bg-red-600 text-white' : 'bg-gray-600 text-white');

export function OrderStatusFilter({ activeFilter, onFilterChange, countByStatus }: OrderStatusFilterProps) {
    const [isOpen, setIsOpen] = useState(false);

    const tabs: { status: OrderStatus; label: string; iconPath: string }[] = [
        { status: 'pending', label: 'Pending Shipments', iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
        { status: 'shipped', label: 'Shipped', iconPath: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
        { status: 'delivered', label: 'Delivered', iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        { status: 'cancelled', label: 'Cancelled', iconPath: 'M6 18L18 6M6 6l12 12' },
    ];

    const activeTabData = tabs.find(t => t.status === activeFilter);

    return (
        <div className="mb-6">
            {/* --- MOBILE VIEW: Dropdown/Accordion --- */}
            <div className="md:hidden">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full p-4 border rounded-lg bg-white shadow-sm"
                >
                    <div className="flex items-center space-x-3">
                        <span className="font-medium text-red-600">{activeTabData?.label}</span>
                        <span className={badgeClasses(true)}>{countByStatus[activeFilter]}</span>
                    </div>
                    {/* Chevron Icon */}
                    <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="mt-2 border rounded-lg bg-white shadow-lg overflow-hidden flex flex-col">
                        {tabs.map(({ status, label }) => (
                            <button
                                key={status}
                                onClick={() => {
                                    onFilterChange(status);
                                    setIsOpen(false);
                                }}
                                className={mobileItemClasses(activeFilter === status)}
                            >
                                <span>{label}</span>
                                <span className={badgeClasses(activeFilter === status)}>{countByStatus[status]}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* --- DESKTOP VIEW: Original Tabs --- */}
            <div className="hidden md:flex items-center space-x-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
                {tabs.map(({ status, label, iconPath }) => (
                    <button
                        key={status}
                        type="button"
                        onClick={() => onFilterChange(status)}
                        className={filterButtonClasses(activeFilter === status)}
                    >
                        <svg
                            className={`w-5 h-5 ${activeFilter === status ? 'text-red-600' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
                        </svg>
                        <span className={(activeFilter === status ? 'font-medium' : '') + ' whitespace-nowrap'}>
                            {label}
                        </span>
                        <span className={badgeClasses(activeFilter === status)}>
                            {countByStatus[status]}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}