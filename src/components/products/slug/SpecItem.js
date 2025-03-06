'use client'
import React from 'react';

export const SpecItem = ({ title, specifications = [], selectedSpecs = [], userSelected = '', onChange }) => {
    if (!specifications.length) return null;

    // Check if a spec is in the product's available specs
    const isSpecAvailable = (spec) => {
        return selectedSpecs.some(s => s._id === spec._id);
    };

    // Check if spec is selected by user
    const isSpecSelected = (spec) => {
        return spec.spec === userSelected;
    };

    return (
        <div className="space-y-2">
            <h3 className="text-sm mb-2 text-gray-400">
                {title}
            </h3>
            <div className="flex flex-col space-y-1">
                {specifications.map((spec) => {
                    const isAvailable = isSpecAvailable(spec);
                    const isSelected = isSpecSelected(spec);

                    return (
                        <button
                            key={spec._id}
                            onClick={() => isAvailable ? onChange(spec) : null}
                            disabled={!isAvailable}
                            className={`
                                px-4 
                                py-2.5 
                                text-sm 
                                text-left 
                                rounded-lg 
                                w-full
                                transition-all 
                                duration-200
                                ${isSelected
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : isAvailable
                                        ? 'bg-black border border-white/50 hover:bg-black/80 text-white'
                                        : 'bg-gray-700/30 text-gray-500 hidden cursor-not-allowed'
                                }
                                ${isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}
                                relative 
                                group
                            `}
                        >
                            <div className="flex justify-between items-center">
                                <span>{spec.spec}</span>
                                {spec.code && (
                                    <span className={`text-xs ${isSelected ? 'opacity-60' : 'opacity-40'}`}>
                                        {spec.code}
                                    </span>
                                )}
                            </div>
                            
                            {!isAvailable && (
                                <div className="absolute left-1/2 -translate-x-1/2 -top-8 
                                    bg-black/90 text-white text-xs py-1 px-2 rounded 
                                    opacity-0 group-hover:opacity-100 pointer-events-none 
                                    transition-opacity whitespace-nowrap">
                                    Not available for this product
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};