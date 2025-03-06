import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const DropdownButton = ({ label, value, onClick, isOpen }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-sm flex items-center justify-between gap-2 transition-all duration-200 
      bg-white/40 hover:bg-white/10 text-gray-300`}
  >
    <span>{value || label}</span>
    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
  </button>
);

const ProductFilters = ({
  applications,
  selectedApplication,
  setSelectedApplication,
  showNewOnly,
  setShowNewOnly,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApplicationSelect = (id) => {
    setSelectedApplication(prev => prev.includes(id)
      ? prev.filter(item => item !== id)
      : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setSelectedApplication([]);
    setShowNewOnly(false);
  };

  // Only count filters that we can actually clear
  const activeFilterCount = [
    selectedApplication.length > 0,
    showNewOnly
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div ref={filterRef} className="flex flex-wrap gap-4">
        {/* Application Dropdown */}
        <div className="relative">
          <DropdownButton
            label="Application"
            value={selectedApplication.length ? `Application (${selectedApplication.length})` : 'Application'}
            onClick={() => setOpenDropdown(openDropdown === 'application' ? null : 'application')}
            isOpen={openDropdown === 'application'}
          />
          {openDropdown === 'application' && applications && (
            <div className="absolute z-50 mt-2 w-56 rounded-lg shadow-lg overflow-y-auto  max-h-60 bg-black border border-white/20">
              {applications.map((item) => (
                <button
                  key={item._id}
                  onClick={() => handleApplicationSelect(item._id)}
                  className="w-full text-left px-4 py-2 hover:bg-white/5 flex items-center"
                >
                  <input
                    type="checkbox"
                    checked={selectedApplication.includes(item._id)}
                    onChange={() => {}}
                    className="mr-2"
                  />
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* New Products Toggle */}
        <button
          onClick={() => setShowNewOnly(!showNewOnly)}
          className={`px-4 py-2 rounded-lg transition-colors
            ${showNewOnly ? 'bg-blue-600 text-white' : 'bg-white/30'}`}
        >
          New
        </button>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-4">
          {selectedApplication.length > 0 && applications?.map(app => 
            selectedApplication.includes(app._id) && (
              <span
                key={app._id}
                className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {app.name}
                <button
                  onClick={() => handleApplicationSelect(app._id)}
                  className="text-white/60 hover:text-white"
                >
                  ×
                </button>
              </span>
            )
          )}
          
          {showNewOnly && (
            <span className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-2">
              New Products
              <button 
                onClick={() => setShowNewOnly(false)} 
                className="text-white/60 hover:text-white"
              >
                ×
              </button>
            </span>
          )}

          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-white/60 hover:text-white ml-2"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilters;