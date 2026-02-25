import React from 'react';

interface SmoothCollapseProps {
    isOpen: boolean;
    children: React.ReactNode;
}

const SmoothCollapse: React.FC<SmoothCollapseProps> = ({ isOpen, children }) => {
    return (
        <div
            style={{ maxHeight: isOpen ? '4000px' : '0px' }}
            className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
        >
            <div className="py-1">
                {children}
            </div>
        </div>
    );
};

export default SmoothCollapse;
