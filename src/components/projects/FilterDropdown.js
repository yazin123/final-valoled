'use client'
import React from 'react';

const FilterDropdown = ({
    options = [],
    selectedValues = [],
    onChange,
    isOpen
}) => {
    if (!isOpen) return null;

    return (
        <div className={`absolute z-50 mt-2 w-full rounded-lg shadow-lg overflow-hidden
           bg-gray-900 border border-gray-700`}
        >
            <div className="max-h-80 overflow-y-auto ">
                {options.map((option) => (
                    <label
                        key={option.id}
                        className={`flex items-center px-4 py-2 cursor-pointer
                           hover:bg-gray-800`}
                    >
                        <input
                            type="checkbox"
                            checked={selectedValues.includes(option.id)}
                            onChange={() => onChange(option.id)}
                            className="w-4 h-4 mr-3 rounded border-gray-300"
                        />
                        <span className={`text-sm text-white`}>
                            {option.name}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default FilterDropdown;