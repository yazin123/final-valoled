import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Animation variants for framer-motion
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  }
};
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useProductTypes, useProducts, useProductCategories, useProductGroups } from '@/hooks/api-hooks';
import Link from 'next/link';

const ProductMenu = ({ isOpen, onClose }) => {
    const [selectedType, setSelectedType] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const {
        data: typesData,
        isLoading: isLoadingTypes,
        error: typesError
    } = useProductTypes();
    const types = typesData || [];

    const {
        data: categoriesData,
        isLoading: isLoadingCategories,
        error: categoriesError
    } = useProductCategories(selectedType?._id);
    const categories = categoriesData || [];

    const {
        data: groupsData,
        isLoading: isLoadingGroups,
        error: groupsError
    } = useProductGroups();
    const groups = groupsData || [];

    const filteredGroups = groups.filter(
        group => group.productCategory?._id === selectedCategory?._id
    );

    const filters = {
        page: 1,
        limit: 10,
        product_type: selectedType?._id ? [selectedType._id] : [],
        product_category: selectedCategory?._id ? [selectedCategory._id] : [],
        product_group: selectedGroup?._id ? [selectedGroup._id] : [],
        application: [],
        sort: 'asc',
        specification: [],
        latest: null
    };

    const {
        data: productsData,
        isLoading: isLoadingProducts,
        error: productsError
    } = useProducts(filters);
    const products = productsData?.data || [];

    const handleTypeSelect = (type) => {
        setSelectedType(type);
        setSelectedCategory(null);
        setSelectedGroup(null);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setSelectedGroup(null);
    };

    const handleGroupSelect = (group) => {
        setSelectedGroup(group);
    };

    const handleBack = () => {
        if (selectedGroup) {
            setSelectedGroup(null);
        } else if (selectedCategory) {
            setSelectedCategory(null);
        } else if (selectedType) {
            setSelectedType(null);
        } else {
            onClose();
        }
    };

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
    );

    const ErrorMessage = ({ message }) => (
        <div className="text-red-500 p-4 text-center">
            {message}
        </div>
    );

    const MenuButton = ({ isSelected, onClick, children, icon = 'arrow', delay = 0 }) => (
        <button
            onClick={onClick}
            className={`w-full text-left py-3 px-2 rounded-md flex items-center justify-between transition-all duration-200 animate-fadeIn 
                ${isSelected
                    ? 'bg-black border border-white/50 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-black hover:border border border-black hover:border-white/50 hover:opacity-100 opacity-65 group'}`}
        >
            {children}
            {icon === 'arrow' ? (
                <ArrowRight className={`w-5 h-5 ${isSelected ? 'bg-blue-500' : ''} group-hover:bg-blue-500 rounded-full group-hover:opacity-100`} />
            ) : (
                <ChevronRight className={`w-5 h-5 ${isSelected ? 'bg-blue-500' : ''} group-hover:bg-blue-500 rounded-full group-hover:opacity-100`} />
            )}
        </button>
    );

    const renderTypes = () => {
        const typesList = [];
        if (isLoadingTypes) return <LoadingSpinner />;
        if (typesError) return <ErrorMessage message="Failed to load product types" />;
        if (!Array.isArray(types)) return null;

        types.forEach((type, index) => {
            typesList.push(
                <motion.div
                    key={type._id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ delay: index * 0.1 }}
                >
            <MenuButton
                key={type._id}
                isSelected={selectedType?._id === type._id}
                onClick={() => handleTypeSelect(type)}
                icon="arrow"
            >
                <div className="flex items-center gap-3">
                    <span>{type.name}</span>
                </div>
            </MenuButton>
                </motion.div>
            );
        });
        
        return (
            <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2"
            >
                {typesList}
            </motion.div>
        );
    };

    const renderCategories = () => {
        if (!selectedType) return null;
        if (isLoadingCategories) return <LoadingSpinner />;
        if (categoriesError) return <ErrorMessage message="Failed to load categories" />;

        if (categories.length === 0) {
            return (
                <div className="text-gray-400 p-4 text-center">
                    No categories found
                </div>
            );
        }

        return categories.map((category, index) => (
            <MenuButton
                key={category._id}
                isSelected={selectedCategory?._id === category._id}
                onClick={() => handleCategorySelect(category)}
                icon="chevron"
            >
                <div className="flex items-center gap-3">
                    <span>{category.name}</span>
                </div>
            </MenuButton>
        ));
    };

    const renderGroups = () => {
        if (!selectedCategory) return null;
        if (isLoadingGroups) return <LoadingSpinner />;
        if (groupsError) return <ErrorMessage message="Failed to load groups" />;

        if (filteredGroups.length === 0) {
            return (
                <div className="text-gray-400 p-4 text-center">
                    No groups found in this category
                </div>
            );
        }

        return filteredGroups.map((group, index) => (
            <MenuButton
                key={group._id}
                isSelected={selectedGroup?._id === group._id}
                onClick={() => handleGroupSelect(group)}
                icon="chevron"
            >
                <div className="flex items-center gap-3">
                    <span>{group.name}</span>
                </div>
            </MenuButton>
        ));
    };

    const renderProducts = () => {
        if (!selectedGroup) return null;
        if (isLoadingProducts) return <LoadingSpinner />;
        if (productsError) return <ErrorMessage message="Failed to load products" />;

        if (products.length === 0) {
            return (
                <div className="text-gray-400 p-4 text-center">
                    No products found in this group
                </div>
            );
        }

        return products.map((product, index) => (
            <Link
                key={product._id}
                href={`/family/products/${product._id}`}
                onClick={onClose}
                className="w-full p-4 rounded-sm flex items-center justify-between
                    bg-white/10 text-gray-300 hover:bg-black hover:border border 
                    border-black hover:border-white/50 hover:opacity-100 opacity-65 
                    transition-all duration-200 group"
            >
                <div className="flex items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-white group-hover:text-white">
                                {product.name}
                            </span>
                            {product.latest && (
                                <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded">
                                    NEW
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:bg-blue-500 rounded-full group-hover:opacity-100" />
            </Link>
        ));
    };

    return (
        <div className="grid grid-cols-4 h-screen">
            {/* First Column - Product Types */}
            <div className="border-r border-gray-800 p-8 overflow-y-scroll bg-black">
                <div className="flex items-center mb-6">
                    <button
                        onClick={handleBack}
                        className="text-white hover:text-gray-300 flex items-center gap-2"
                    >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                        Products
                    </button>
                </div>
                <div className="space-y-2">
                    {renderTypes()}
                </div>
            </div>

            {/* Second Column - Categories */}
            <div className={`transform transition-all duration-300 ease-in-out p-4 overflow-y-scroll ${selectedType ? 'opacity-100 translate-x-0 bg-black border-r border-gray-800' : 'opacity-0 translate-x-4'}`}>
                {selectedType && (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl text-white font-semibold">{selectedType.name}</h2>
                            <Link
                                href={`/family/products?type=${selectedType._id}`}
                                onClick={onClose}
                                className="px-4 py-2 text-sm text-white rounded-lg border border-gray-700 
                                    hover:bg-gray-800 transition-colors"
                            >
                                See all
                            </Link>
                        </div>
                        <div className="space-y-2">
                            {renderCategories()}
                        </div>
                    </>
                )}
            </div>

            {/* Third Column - Groups */}
            <div className={`transform transition-all duration-300 ease-in-out p-4 overflow-y-scroll ${selectedCategory ? 'opacity-100 translate-x-0 bg-black border-r border-gray-800' : 'opacity-0 translate-x-4'}`}>
                {selectedCategory && (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl text-white font-semibold">{selectedCategory.name}</h2>
                            <Link
                                href={`/family/products?type=${selectedType._id}&category=${selectedCategory._id}`}
                                onClick={onClose}
                                className="px-4 py-2 text-sm text-white rounded-lg border border-gray-700 
                                    hover:bg-gray-800 transition-colors"
                            >
                                See all
                            </Link>
                        </div>
                        <div className="space-y-2">
                            {renderGroups()}
                        </div>
                    </>
                )}
            </div>

            {/* Fourth Column - Products */}
            <div className={`transform transition-all duration-300 ease-in-out p-4 overflow-y-scroll ${selectedGroup ? 'opacity-100 translate-x-0 bg-black border-r border-gray-800' : 'opacity-0 translate-x-4'}`}>
                {selectedGroup && (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl text-white font-semibold">{selectedGroup.name}</h2>
                            <Link
                                href={`/family/products?type=${selectedType._id}&category=${selectedCategory._id}&group=${selectedGroup._id}`}
                                onClick={onClose}
                                className="px-4 py-2 text-sm text-white rounded-lg border border-gray-700 
                                    hover:bg-gray-800 transition-colors"
                            >
                                See all
                            </Link>
                        </div>
                        <div className="space-y-2">
                            {renderProducts()}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductMenu;