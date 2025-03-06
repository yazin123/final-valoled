'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductShowcase from '@/components/products/ProductShowcase';
import FilteredProducts from '@/components/products/FilteredProducts';
import { Loader2 } from 'lucide-react';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-white" />
  </div>
);

const Page = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    setIsClient(true);
    
    // Try to restore state from localStorage
    try {
      const savedType = localStorage.getItem('selectedType');
      const savedCategory = localStorage.getItem('selectedCategory');
      const savedGroup = localStorage.getItem('selectedGroup');

      if (savedType) setSelectedType(JSON.parse(savedType));
      if (savedCategory) setSelectedCategory(JSON.parse(savedCategory));
      if (savedGroup) setSelectedGroup(JSON.parse(savedGroup));
    } catch (error) {
      console.error('Error restoring state:', error);
    }
  }, []);

  const handleShowcaseSelect = (type, category, group) => {
    setSelectedType(type);
    setSelectedCategory(category);
    setSelectedGroup(group);

    // Save to localStorage
    try {
      if (type) localStorage.setItem('selectedType', JSON.stringify(type));
      if (category) localStorage.setItem('selectedCategory', JSON.stringify(category));
      if (group) localStorage.setItem('selectedGroup', JSON.stringify(group));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  if (!isClient) return <LoadingSpinner />;

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen w-full md:px-6 mx-auto px-4 md:py-32 py-16"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="product-showcase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <ProductShowcase
            onSelect={handleShowcaseSelect}
            selectedType={selectedType}
            selectedCategory={selectedCategory}
            selectedGroup={selectedGroup}
          />
        </motion.div>

        {selectedType && (
          <motion.div
            key="filtered-products"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FilteredProducts
              key={`${selectedType?._id}-${selectedCategory?._id}-${selectedGroup?._id}`}
              selectedType={selectedType}
              selectedCategory={selectedCategory}
              selectedGroup={selectedGroup}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Page;