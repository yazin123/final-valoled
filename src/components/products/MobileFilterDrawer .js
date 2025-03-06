import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

const MobileFilterDrawer = ({
  isOpen,
  onClose,
  types = [],
  categories = [],
  groups = [],
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  selectedGroup,
  setSelectedGroup,
  selectedApplication,
  setSelectedApplication,
  showNewOnly,
  setShowNewOnly,
  sortDirection,
  setSortDirection,
  sortOptions
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const applications = ['Residential', 'Commercial', 'Industrial', 'Outdoor'];

  const FilterDropdown = ({ label, options, value, onChange }) => (
    <div className="space-y-2">
      <button
        onClick={() => setActiveDropdown(activeDropdown === label ? null : label)}
        className={`w-full px-4 py-3 rounded-lg border flex items-center justify-between
         border-white/50`}
      >
        <span>{options.find(opt => 
          typeof opt === 'string' ? opt === value : opt._id === value)?.name || 
          value || 
          label}
        </span>
        <ChevronDown className={`w-4 h-4 transform transition-transform duration-300 
          ${activeDropdown === label ? 'rotate-180' : ''}`} 
        />
      </button>

      <div className={`transform transition-all duration-300 ease-in-out overflow-hidden
        ${activeDropdown === label ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className={`mt-2 rounded-lg border 
          bg-zinc-900 border-white/10`}
        >
          {options.map((option) => (
            <button
              key={typeof option === 'string' ? option : option._id}
              onClick={() => {
                onChange(typeof option === 'string' ? option : option._id);
                setActiveDropdown(null);
              }}
              className={`block w-full text-left px-4 py-3 transition-colors duration-200
                ${(value === option || value === option._id) ? 
                  'bg-white/10'  
                  : ''
                }
                hover:bg-white/5`}
            >
              {typeof option === 'string' ? option : option.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Drawer */}
      <div className={`fixed md:hidden inset-y-0 right-0 w-80 
      bg-black transform transition-all duration-300 ease-in-out z-50 
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b 
            border-gray-800`}
          >
            <h2 className="text-xl font-semibold">Filters</h2>
            <button onClick={onClose} className="p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Filter Options */}
          <div className="flex-1 overflow-y-auto  p-4 space-y-6">
            <FilterDropdown
              label="Product Type"
              options={types}
              value={selectedType}
              onChange={setSelectedType}
            />

            <FilterDropdown
              label="Category"
              options={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />

            <FilterDropdown
              label="Group"
              options={groups}
              value={selectedGroup}
              onChange={setSelectedGroup}
            />

            <FilterDropdown
              label="Application"
              options={applications}
              value={selectedApplication}
              onChange={setSelectedApplication}
            />

            {/* New Products Toggle */}
            <button
              onClick={() => setShowNewOnly(!showNewOnly)}
              className={`w-full px-4 py-3 rounded-lg border flex items-center justify-between
                ${showNewOnly ? 'bg-blue-600 text-white border-blue-600' : 
                 'border-white/50' }`}
            >
              <span>New</span>
              <div className={`w-4 h-4 rounded transition-colors duration-200
                ${showNewOnly ? 'bg-white' : ''} border
                border-white`} 
              />
            </button>

            <FilterDropdown
              label="Sort by"
              options={sortOptions}
              value={sortDirection}
              onChange={setSortDirection}
            />
          </div>

          {/* Apply Button */}
          <div className={`p-4 border-t border-gray-800`}>
            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                transition-colors duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out z-40"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default MobileFilterDrawer;