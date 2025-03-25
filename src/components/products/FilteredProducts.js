'use client'
import { useState } from 'react';
import { useProducts, useProductGroups } from '@/hooks/api-hooks';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Animation variants
const containerVariants = {
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

const itemVariants = {
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
    y: -20,
    transition: { duration: 0.2 }
  }
};

// Loading skeleton component
const LoadingSkeleton = () => (
  <motion.div
    variants={itemVariants}
    className="rounded-3xl border border-gray-200/20 shadow-sm overflow-hidden"
  >
    <motion.div
      className="aspect-square bg-gray-800"
      animate={{
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <div className="p-8 space-y-4">
      <motion.div
        className="h-4 bg-gray-800 rounded w-2/3 mx-auto"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2
        }}
      />
      <motion.div
        className="h-3 bg-gray-800 rounded w-1/2 mx-auto"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4
        }}
      />
    </div>
  </motion.div>
);

// Product card component with animations
const ProductCard = ({ group, onSelect }) => (
  <motion.div
    variants={itemVariants}
    layout
    onClick={() => onSelect(group)}
    className="relative rounded-3xl border border-gray-200/20 shadow-sm overflow-hidden cursor-pointer group"
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.98 }}
  >
    {group.latest && (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-3 right-3 z-10 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full"
      >
        NEW
      </motion.div>
    )}
    <div className="aspect-square flex items-center justify-center p-4">
      <motion.div
        className="w-full h-full relative rounded-2xl overflow-hidden"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          width={200}
          height={200}
          src={group.image_url || '/placeholder.jpg'}
          alt={group.name}
          className="object-cover w-full h-[50vh] transition-transform duration-300"
        />
      </motion.div>
    </div>
    <motion.div
      className="pb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col text-center">
        <span className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors">
          {group.name}
        </span>
        <span className="text-gray-400 text-xs uppercase tracking-wider">
          {group.productType?.name || 'Lighting'}
        </span>
      </div>
    </motion.div>
  </motion.div>
);

const FilteredProducts = ({ selectedType, selectedCategory }) => {
  const router = useRouter();
  const { data: groupsData, isLoading: isGroupsLoading } = useProductGroups();
  const groups = Array.isArray(groupsData) ? groupsData : [];
  console.log("the data of categories are: ", groups)
  // Filter groups based on selected type and category
  const filteredGroups = groups.filter(group => {
    if (selectedCategory) {
      return group.productCategory?._id === selectedCategory._id;
    }
    return group.productType?._id === selectedType?._id;
  });

  const handleGroupSelect = (group) => {
    router.push(`/family/products?type=${selectedType?._id || ''}&category=${selectedCategory?._id || ''}&group=${group._id}`);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="w-full"
    >
      <div className="space-y-6">
        <motion.div
          layout
          className="flex justify-between items-center"
        >
          <motion.h2
            layout
            className="text-3xl font-semibold text-white"
          >
            Product Family
          </motion.h2>
          <AnimatePresence mode="wait">
            <motion.span
              key={filteredGroups.length}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full"
            >
              {`${filteredGroups.length} Family`}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory?._id || selectedType?._id || 'loading'}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid md:grid-cols-4 gap-8"
          >
            {isGroupsLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <LoadingSkeleton key={idx} />
              ))
            ) : filteredGroups.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="col-span-full text-center py-12 text-gray-400"
              >
                No product groups found
              </motion.div>
            ) : (
              filteredGroups.map((group) => (
                <ProductCard
                  key={group._id}
                  group={group}
                  onSelect={handleGroupSelect}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FilteredProducts;