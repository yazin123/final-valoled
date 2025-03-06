
import React, { useRef } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';


const FilterButton = ({
    label,
    count = 0,
    isActive,
    onClick,
    isLoading
}) => {
    const filterRef = useRef(null);
    return (
        <button ref={filterRef}
            onClick={onClick}
            className={`px-4 py-2 rounded-sm flex items-center justify-between gap-2 transition-all duration-200 
                ${isActive
                    ? 'bg-white/60 text-white'
                    : 'bg-white/40 hover:bg-white/10 text-gray-300'}`}
        >
            <span className="truncate">
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                ) : count > 0 ? (
                    `${label} (${count})`
                ) : (
                    label
                )}
            </span>
            <ChevronDown
                className={`w-4 h-4 transform transition-transform duration-300 
                    ${isActive ? 'rotate-180' : ''}`}
            />
        </button>
    );
};



export default FilterButton
