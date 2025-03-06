
import { useSearchParams } from 'next/navigation';
import { useProducts, useProductTypes, useProductGroups, useSpecifications } from '@/hooks/api-hooks';
import { useState, useEffect } from 'react';
import { Loader2, ChevronLeft, ArrowUpDown, X, ChevronDown, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


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

  // States
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedSpecs, setSelectedSpecs] = useState({});
  const [showSpecsFilter, setShowSpecsFilter] = useState(false);
  const [expandedSpec, setExpandedSpec] = useState(null);

  // Fetch data
  const { data: types = [] } = useProductTypes();
  const { data: groups = [] } = useProductGroups();
  const { data: specifications = [] } = useSpecifications();

  // Function to clear a specific filter
  const clearFilter = (filterType) => {
    const currentParams = new URLSearchParams(searchParams);
    
    switch(filterType) {
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
    }

    router.push(`/family/products?${currentParams.toString()}`);
  };

  // Initialize from URL params
  useEffect(() => {
    if (typeId) {
      const type = types.find(t => t._id === typeId);
      setSelectedType(type || null);
    }

    if (categoryId) {
      const category = groups.find(c => c._id === categoryId);
      setSelectedCategory(category || null);
    }

    if (groupId) {
      const group = groups.find(g => g._id === groupId);
      setSelectedGroup(group || null);
    }
  }, [typeId, categoryId, groupId, types, groups]);

  // Handle specification changes
  const handleSpecChange = (specId, valueId) => {
    setSelectedSpecs(prev => ({
      ...prev,
      [specId]: prev[specId]?.includes(valueId)
        ? prev[specId].filter(id => id !== valueId)
        : [...(prev[specId] || []), valueId]
    }));
  };

  // Clear specifications
  const handleClearSpecs = () => {
    setSelectedSpecs({});
    setExpandedSpec(null);
  };

  // Get selected specs count
  const selectedCount = Object.values(selectedSpecs).reduce(
    (acc, curr) => acc + curr.length,
    0
  );

  // Format specifications for API
  const formattedSpecifications = Object.entries(selectedSpecs)
    .filter(([_, values]) => values.length > 0)
    .flatMap(([specId, values]) => 
      values.map(valueId => ({
        specification: specId,
        spec_item: valueId,
        spec_values: [valueId]
      }))
    );

  // Create filters object for API
  const filters = {
    page: 1,
    limit: 25,
    product_type: selectedType ? [selectedType._id] : [],
    product_category: selectedCategory ? [selectedCategory._id] : [],
    product_group: selectedGroup ? [selectedGroup._id] : [],
    sort: sortDirection,
    specification: formattedSpecifications.length > 0 ? formattedSpecifications : undefined,
    latest: showNewOnly || undefined
  };

  // Fetch products
  const { 
    data: productsData, 
    isLoading: isLoadingProducts,
    error: productsError 
  } = useProducts(filters);

  if (productsError) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-white">
        <p className="text-red-400">Error loading products: {productsError.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full md:px-6 mx-auto px-4 md:py-32 py-16 text-white md:flex">
      {/* Specifications Filter Panel */}
      {showSpecsFilter && (
        <>
          <div className="md:mr-3 h-screen w-[400px] bg-zinc-900 shadow-xl z-[101] flex flex-col transform transition-transform duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <h2 className="text-xl font-semibold">Filter</h2>
              </div>
              <button
                onClick={() => setShowSpecsFilter(false)}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto ">
              <div className="p-4 space-y-4">
                {specifications.map(spec => (
                  <div key={spec._id} className="border-b border-white/10 last:border-0">
                    <button
                      onClick={() => setExpandedSpec(expandedSpec === spec._id ? null : spec._id)}
                      className="w-full py-3 flex items-center justify-between text-left"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-medium">{spec.name}</span>
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
                      <div className="pb-3 space-y-2">
                        {spec.specifications?.map(value => (
                          <label
                            key={value._id}
                            className="flex items-center px-2 py-1.5 rounded hover:bg-white/5 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSpecs[spec._id]?.includes(value._id) || false}
                              onChange={() => handleSpecChange(spec._id, value._id)}
                              className="rounded border-gray-600 w-4 h-4"
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

            {/* Footer */}
            {selectedCount > 0 && (
              <div className="border-t border-white/10 bg-zinc-900 p-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selectedSpecs).map(([specId, values]) =>
                    values.map(valueId => {
                      const spec = specifications.find(s => s._id === specId);
                      const value = spec?.specifications?.find(v => v._id === valueId);
                      if (!spec || !value) return null;
                      return (
                        <span
                          key={`${specId}-${valueId}`}
                          className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {value.spec}
                          <button
                            onClick={() => handleSpecChange(specId, valueId)}
                            className="hover:text-blue-300"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={handleClearSpecs}
                    className="text-sm text-white/60 hover:text-white"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setShowSpecsFilter(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div className="space-y-6 w-full">
        {/* Top Filters */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowSpecsFilter(true)}
            className="px-4 py-2 rounded-sm flex items-center justify-between gap-2 transition-all duration-200 
            bg-white/40 hover:bg-white/10 text-gray-300"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
            {selectedCount > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                {selectedCount}
              </span>
            )}
          </button>

          {/* Sort Direction */}
          <button
            onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 rounded flex items-center gap-2 bg-white/40 hover:bg-white/10 text-gray-300"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>{sortDirection === 'asc' ? 'Newest First' : 'Oldest First'}</span>
          </button>

          {/* New Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-gray-300">
            <input
              type="checkbox"
              checked={showNewOnly}
              onChange={(e) => setShowNewOnly(e.target.checked)}
              className="rounded border-gray-600"
            />
            <span>New Products Only</span>
          </label>
        </div>

        {/* Page Title and Filters */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-medium">Products</h1>
            <span className="px-3 py-1 text-sm rounded-full border border-white/20">
              {`${productsData?.data?.length || 0} Products`}
            </span>
          </div>

          {/* Selected Filters */}
          {(selectedType || selectedCategory || selectedGroup) && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium mr-2">Filters:</span>
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
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {isLoadingProducts ? (
            Array.from({ length: 12 }).map((_, idx) => (
              <div 
                key={idx} 
                className="rounded-3xl border border-gray-200/20 shadow-sm aspect-square animate-pulse bg-gray-800"/>
            ))
          ) : productsData?.data?.length > 0 ? (
            productsData.data.map((product) => (
              <ProductCard 
                key={product._id}
                product={product}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-400">
              No products found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;