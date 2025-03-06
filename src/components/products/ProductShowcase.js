'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useProductTypes, useProductCategories } from '@/hooks/api-hooks';
import { Loader2, ChevronRight, ImageOff } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants - keeping the original ones
const contentVariants = {
  hidden: { 
    opacity: 0,
    y: 20,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 }
  }
};

const tabVariants = {
  inactive: { 
    scale: 1,
    transition: { duration: 0.2 }
  },
  active: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

const gridItemVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

const ProductShowcase = ({ onSelect, selectedType, selectedCategory }) => {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('initialType');
  const router = useRouter();
  
  // Add mounted state to handle initial load
  const [mounted, setMounted] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState({});

  const { data: types, isLoading: isTypesLoading } = useProductTypes();
  const { data: categories, isLoading: isCategoriesLoading } = useProductCategories(
    selectedType?._id || types?.find(t => t.name === selectedType?.name || 'Indoor')?._id
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && types && !selectedType && !initialType) {
      const indoorType = types.find(t => t.name === 'Indoor');
      if (indoorType) {
        onSelect(indoorType, null);
      }
    }
  }, [types, selectedType, initialType, mounted, onSelect]);

  const activeTab = selectedType?.name || 'Indoor';

  const handleImageLoad = (id) => {
    setIsImageLoading(prev => ({ ...prev, [id]: false }));
  };

  const handleTabChange = (tab) => {
    const type = types.find(t => t.name === tab);
    onSelect(type, null);
  };

  const handleCategoryClick = (category) => {
    onSelect(selectedType, category);
  };

  // Return null before mounting to prevent flash of content
  if (!mounted) return null;

  return (
    <motion.div 
      className="w-full mt-5 text-white border-b border-white/20 mb-12 pb-8"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={contentVariants}
    >
      <AnimatePresence mode="wait">
        <motion.nav 
          className="grid grid-cols-2 md:grid-cols-8 gap-3 mb-8" 
          role="tablist" 
          aria-label="Product Types"
        >
          {types?.filter(type => type.isVisible !== false).map((type) => (
            <motion.button
              key={type._id}
              onClick={() => handleTabChange(type.name)}
              role="tab"
              aria-selected={activeTab === type.name}
              aria-controls={`${type.name.toLowerCase()}-panel`}
              className={`px-8 py-3 rounded-lg border transition-all duration-300 text-sm font-semibold 
                focus:outline-none focus:ring-2 focus:ring-offset-2 
                ${activeTab === type.name
                  ? 'bg-white text-black border-white'
                  : 'border-gray-300 hover:border-gray-900 dark:border-white/50 dark:hover:border-white text-white'
                }`}
              variants={tabVariants}
              initial="inactive"
              animate={activeTab === type.name ? "active" : "inactive"}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {type.name}
            </motion.button>
          ))}
        </motion.nav>
      </AnimatePresence>

      <motion.div 
        className="flex justify-between items-center mb-8"
        layout
      >
        <motion.h2 
          className="text-4xl capitalize"
          layout
        >
          {selectedCategory?.name || activeTab}
        </motion.h2>
        <motion.span 
          className="px-3 py-1 text-sm rounded-full border border-white/20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {`${categories?.length || 0} Categories`}
        </motion.span>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedType?._id || 'default'}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-2 md:grid-cols-8 gap-4"
        >
          {(isTypesLoading || isCategoriesLoading) && mounted ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, idx) => (
              <motion.div 
                key={idx}
                variants={gridItemVariants}
                className="animate-pulse rounded-lg border border-gray-800 overflow-hidden"
              >
                <div className="p-3 space-y-3">
                  <div className="aspect-video rounded-lg bg-gray-800" />
                  <div className="h-4 w-3/4 bg-gray-800 rounded" />
                </div>
              </motion.div>
            ))
          ) : categories?.length === 0 ? (
            <div className="col-span-full flex items-center justify-center py-12 text-gray-400">
              No categories found
            </div>
          ) : (
            categories?.map((category) => (
              <motion.div
                key={category._id}
                variants={gridItemVariants}
                onClick={() => handleCategoryClick(category)}
                className={`cursor-pointer group pb-2 ${
                  selectedCategory?._id === category._id ? 'border-b-2 border-white' : ''
                }`}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="rounded-lg overflow-hidden">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                    {isImageLoading[category._id] !== false && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                      </div>
                    )}
                    <Image
                      src={category.image_url || '/placeholder.jpg'}
                      alt={category.name}
                      fill
                      className={`object-cover rounded-lg transition-transform duration-300 group-hover:scale-105 ${
                        isImageLoading[category._id] !== false ? 'opacity-0' : 'opacity-100'
                      }`}
                      onLoad={() => handleImageLoad(category._id)}
                      onError={() => handleImageLoad(category._id)}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm font-medium group-hover:text-blue-400 transition-colors">
                      {category.name}
                    </p>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductShowcase;