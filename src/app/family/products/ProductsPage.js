'use client'
import { useSearchParams } from 'next/navigation';
import { useProducts, useProductTypes, useProductGroups, useSpecifications, useApplications, useProductCategories } from '@/hooks/api-hooks';
import { useState, useEffect, Suspense, useMemo, useRef } from 'react';
import { Loader2, ChevronLeft, ArrowUpDown, X, ChevronDown, Filter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SpecificationsFilter from '@/components/products/SpecificationsFilter';

import { motion, AnimatePresence } from 'framer-motion';


const ApplicationDropdown = ({
  applications = [],
  selectedApplication,
  setSelectedApplication,
  isLoading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`px-4 py-2 rounded-sm flex items-center justify-between gap-2 transition-all duration-200 
            ${isOpen
            ? 'bg-black border border-white/50 text-white'
            : 'bg-white/30 text-gray-300 hover:bg-black hover:border border border-black hover:border-white/50'}`}
      >
        <span className="truncate">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
          ) : (
            selectedApplication?.name || "All Applications"
          )}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-64 rounded-lg shadow-lg overflow-hidden
                bg-black border border-gray-700"
          >
            <motion.div
              className="max-h-80 overflow-y-auto py-2"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {/* All Applications option */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
                className={`flex items-center px-4 py-2 cursor-pointer
                  hover:bg-white/5 transition-colors ${!selectedApplication ? 'text-blue-400' : 'text-white'}`}
                onClick={() => {
                  setSelectedApplication(null);
                  setIsOpen(false);
                }}
              >
                All Applications
              </motion.div>

              {/* Application options */}
              {applications.map((app) => (
                <motion.div
                  key={app._id}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className={`flex items-center px-4 py-2 cursor-pointer
                    hover:bg-white/5 transition-colors ${selectedApplication?._id === app._id ? 'text-blue-400' : 'text-white'}`}
                  onClick={() => {
                    setSelectedApplication(app);
                    setIsOpen(false);
                  }}
                >
                  <span className="text-sm">
                    {app.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const ProductCard = ({ product }) => (
  <Link
    href={`/family/products/${product._id}`}
    className="relative rounded-3xl border border-gray-200/20 shadow-sm overflow-hidden cursor-pointer group"
  >
    {product.latest && (
      <div className="absolute top-3 right-3 z-10 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
        NEW
      </div>
    )}
    <div className="aspect-square flex items-center justify-center p-4">
      <Image
        width={200}
        height={200}
        src={product.imageUrl || '/placeholder.jpg'}
        alt={product.name}
        className="object-cover w-full h-full rounded-2xl transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className="pb-8">
      <div className="flex flex-col text-center">
        <span className="text-white font-medium text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
          {product.name}
        </span>
        <span className="text-gray-400 text-xs uppercase tracking-wider">
          {product.code}
        </span>
      </div>
    </div>
  </Link>
);

const ProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeId = searchParams.get('type');
  const categoryId = searchParams.get('category');
  const groupId = searchParams.get('group');
  const productName = searchParams.get('name');

  // States
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedSpecs, setSelectedSpecs] = useState({});
  const [showSpecsFilter, setShowSpecsFilter] = useState(false);
  const [expandedSpec, setExpandedSpec] = useState(null);

  // Fetch data
  const { data: types = [] } = useProductTypes();
  const { data: categoriesData = [] } = useProductCategories(typeId);
  const { data: groups = [] } = useProductGroups();
  const { data: specifications = [] } = useSpecifications();
  const { data: applications = [], isLoading: isLoadingApplications } = useApplications();

  // Memoize the filters object to prevent unnecessary rerenders
  const currentFilters = useMemo(() => {
    // Format specifications to match backend expectations
    const formattedSpecs = Object.entries(selectedSpecs)
      .filter(([_, values]) => values.length > 0)
      .map(([specId, selectedValues]) => ({
        specification: specId,  // This is the specification ID
        spec_item: selectedValues[0], // Use the first selected value as spec_item
        spec_values: selectedValues // All selected values go here as spec_values
      }));

    return {
      page: 1,
      limit: 25,
      product_type: selectedType ? [selectedType._id] : [],
      product_category: selectedCategory ? [selectedCategory._id] : [],
      product_group: selectedGroup ? [selectedGroup._id] : [],
      application: selectedApplication ? [selectedApplication._id] : [],
      sort: sortDirection,
      specification: formattedSpecs,
      latest: showNewOnly,
      search: productName || ''
    };
  }, [
    selectedType,
    selectedCategory,
    selectedGroup,
    selectedApplication,
    selectedSpecs,
    showNewOnly,
    sortDirection,
    productName
  ]);

  useEffect(() => {
    console.log('Current filters:', currentFilters);
  }, [currentFilters]);


  // Initialize from URL params
  useEffect(() => {
    if (typeId) {
      const type = types.find(t => t._id === typeId);
      setSelectedType(type || null);
    }

    if (categoryId && categoriesData.length > 0) {
      const category = categoriesData.find(c => c._id === categoryId);
      setSelectedCategory(category || null);
    }

    if (groupId) {
      const group = groups.find(g => g._id === groupId);
      setSelectedGroup(group || null);
    }
  }, [typeId, categoryId, groupId, types, categoriesData, groups]);

  // Clear specific filter
  const clearFilter = (filterType) => {
    const currentParams = new URLSearchParams(searchParams);

    switch (filterType) {
      case 'type':
        currentParams.delete('type');
        setSelectedType(null);
        break;
      case 'category':
        currentParams.delete('category');
        setSelectedCategory(null);
        break;
      case 'group':
        currentParams.delete('group');
        setSelectedGroup(null);
        break;
      case 'search':
        currentParams.delete('name');
        break;
    }

    router.push(`/family/products?${currentParams.toString()}`);
  };

  // Handle specification changes
  const handleSpecChange = (specId, valueId) => {
    setSelectedSpecs(prev => {
      const currentValues = prev[specId] || [];
      const newValues = currentValues.includes(valueId)
        ? currentValues.filter(id => id !== valueId)
        : [...currentValues, valueId];

      // If no values are selected, remove the spec entirely
      const newSpecs = {
        ...prev,
        [specId]: newValues
      };

      if (newValues.length === 0) {
        delete newSpecs[specId];
      }

      return newSpecs;
    });
  };
  // Handle clearing all specifications
  const handleClearSpecs = () => {
    setSelectedSpecs({});
    setExpandedSpec(null);
  };

  // Main products query
  const { data: productsData, isLoading: isLoadingProducts, error: productsError } = useProducts(currentFilters);

  // Calculate selected specs count
  const selectedCount = Object.values(selectedSpecs).reduce(
    (acc, curr) => acc + curr.length,
    0
  );

  if (productsError) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-white">
        <p className="text-red-400">Error loading products: {productsError.message}</p>
      </div>
    );
  }
  return (
    <div className='min-h-screen w-full md:px-6 mx-auto px-4 md:py-32 py-16 text-white'>
      <div className="mb-5">
        <Link
          href="/family"
          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Family</span>
        </Link>
      </div>
      <div className="">
        {/* Specifications Filter Panel */}
        <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center text-white">Loading...</div>}>
          {showSpecsFilter && (
            <SpecificationsFilter
              showSpecsFilter={showSpecsFilter}
              setShowSpecsFilter={setShowSpecsFilter}
              specifications={specifications}
              selectedSpecs={selectedSpecs}
              handleSpecChange={handleSpecChange}
              handleClearSpecs={handleClearSpecs}
              selectedCount={selectedCount}
            />
          )}

          <div className="space-y-6 w-full">
            {/* Top Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Existing Filter button */}
              <button
                onClick={() => setShowSpecsFilter(true)}
                className="px-4 py-2 rounded-sm flex items-center justify-between gap-2 transition-all duration-200 
                bg-white/30 text-gray-300 hover:bg-black hover:border border border-black hover:border-white/50"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                {selectedCount > 0 && (
                  <span className="px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                    {selectedCount}
                  </span>
                )}
              </button>

              {/* Enhanced Application Dropdown */}
              <ApplicationDropdown
                applications={applications}
                selectedApplication={selectedApplication}
                setSelectedApplication={setSelectedApplication}
                isLoading={isLoadingApplications}
              />

              {/* Sort button with matching styling */}
              {/* <motion.button
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-sm flex items-center justify-between gap-2 transition-all duration-200 
                bg-white/30 text-gray-300 hover:bg-black hover:border border border-black hover:border-white/50"
              >
                <span>Sort: {sortDirection === 'asc' ? 'Newest First' : 'Oldest First'}</span>
                <ArrowUpDown className="w-4 h-4" />
              </motion.button> */}

              {/* New Products toggle with matching styling */}
              {/* <motion.label
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-sm flex items-center justify-between gap-2 transition-all duration-200 
                bg-white/30 text-gray-300 hover:bg-black hover:border border border-black hover:border-white/50 cursor-pointer"
              >
                <span>New Products Only</span>
                <input
                  type="checkbox"
                  checked={showNewOnly}
                  onChange={(e) => setShowNewOnly(e.target.checked)}
                  className="rounded border-gray-600"
                />
              </motion.label> */}
            </div>

            {/* Selected Filters */}
            {(selectedType || selectedCategory || productName || selectedGroup || selectedApplication) && (
              <div className="rounded-lg">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium mr-2">Filters:</span>
                  {productName && (
                    <div className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      Search: {productName}
                      <button
                        onClick={() => clearFilter('search')}
                        className="hover:text-blue-300"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {selectedType && (
                    <div className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      Type: {selectedType.name}
                      <button
                        onClick={() => clearFilter('type')}
                        className="hover:text-blue-300"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {selectedCategory && (
                    <div className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      Category: {selectedCategory.name}
                      <button
                        onClick={() => clearFilter('category')}
                        className="hover:text-blue-300"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {selectedGroup && (
                    <div className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      Family: {selectedGroup.name}
                      <button
                        onClick={() => clearFilter('group')}
                        className="hover:text-blue-300"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {selectedApplication && (
                    <div className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      Application: {selectedApplication.name}
                      <button
                        onClick={() => setSelectedApplication(null)}
                        className="hover:text-blue-300"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Page Title and Filters */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-medium">Products</h1>
                <span className="px-3 py-1 text-sm rounded-full border border-white/20">
                  {`${productsData?.data?.length || 0} Products`}
                </span>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {isLoadingProducts ? (
                Array.from({ length: 12 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl border border-gray-200/20 shadow-sm aspect-square animate-pulse bg-gray-800" />
                ))
              ) : productName && (!productsData?.data || productsData.data.length === 0) ? (
                <div className="col-span-full text-center py-12 text-gray-400">
                  No product found with the name "{productName}". Please check the product name again.
                </div>
              ) : productsData?.data ? (
                // Handle single search result or multiple products
                Array.isArray(productsData.data) ? (
                  productsData.data.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))
                ) : (
                  <ProductCard product={productsData.data} />
                )
              ) : (
                <div className="col-span-full text-center py-12 text-gray-400">
                  No products found matching your criteria
                </div>
              )}
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default ProductsPage;