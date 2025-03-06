'use client'
import React from 'react';
import { ChevronDown } from 'lucide-react';

const ProductSpecificationFilters = ({
  specifications = [],
  selectedSpecs,
  onSpecChange,
  expandedSpec,
  setExpandedSpec,
  className = ''
}) => {
  return (
    <div className={`w-72 bg-zinc-900 rounded-lg overflow-hidden ${className}`}>
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Specifications</h3>
      </div>
      
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto ">
        {specifications.map(spec => (
          <div key={spec._id} className="border-b border-white/10 last:border-0">
            <button
              onClick={() => setExpandedSpec(expandedSpec === spec._id ? null : spec._id)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5"
            >
              <span className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{spec.name}</span>
                {selectedSpecs[spec._id]?.length > 0 && (
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                    {selectedSpecs[spec._id]?.length}
                  </span>
                )}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 
                  ${expandedSpec === spec._id ? 'rotate-180' : ''}`}
              />
            </button>

            {expandedSpec === spec._id && (
              <div className="px-4 pb-3 space-y-2">
                {spec.specifications?.map(value => (
                  <label
                    key={value._id}
                    className="flex items-center px-2 py-1.5 rounded hover:bg-white/5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSpecs[spec._id]?.includes(value._id) || false}
                      onChange={() => onSpecChange(spec._id, value._id)}
                      className="rounded border-gray-600 text-blue-600 w-4 h-4"
                    />
                    <span className="ml-3 text-sm text-gray-300">{value.spec}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSpecificationFilters;