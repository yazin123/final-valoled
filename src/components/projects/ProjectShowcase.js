'use client'
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
    useProjects,
    useProjectCategories,
    useProductTypes,
    useProductGroups,
    useProductCategoriesNew
} from '@/hooks/api-hooks';

// Animation variants
const containerVariants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 }
    }
};

// Enhanced FilterButton with animations
const FilterButton = ({
    label,
    count = 0,
    isActive,
    onClick,
    isLoading,
    dataFilter
}) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        data-filter={dataFilter}
        className={`px-4 py-2 rounded-sm flex items-center justify-between gap-2 transition-all duration-200 
            ${isActive
                ? 'bg-black border border-white/50 text-white'
                : 'bg-white/30 text-gray-300 hover:bg-black hover:border border border-black hover:border-white/50'}`}
    >
        <span className="truncate">
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
            ) : count > 0 ? (
                `${label} (${count})`
            ) : (
                label
            )}
        </span>
        <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3 }}
        >
            <ChevronDown className="w-4 h-4" />
        </motion.div>
    </motion.button>
);

// Enhanced FilterDropdown with animations
const FilterDropdown = ({
    options = [],
    selectedValues = [],
    onChange,
    isOpen,
    filterType
}) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                id={`dropdown-${filterType}`}
                data-dropdown={filterType}
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
                    {options.map((option) => (
                        <motion.label
                            key={option.id}
                            variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: { opacity: 1, x: 0 }
                            }}
                            className="flex items-center px-4 py-2 cursor-pointer
                                hover:bg-white/5 transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={selectedValues.includes(option.id)}
                                onChange={() => onChange(option.id)}
                                className="w-4 h-4 mr-3 rounded border-gray-300"
                            />
                            <span className="text-sm text-white">
                                {option.name}
                            </span>
                        </motion.label>
                    ))}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

// Project Card Component
const ProjectCard = ({ project }) => (
    <motion.div
        variants={cardVariants}
        whileHover={{ y: -10 }}
        whileTap={{ scale: 0.98 }}
        className="relative rounded-3xl border border-gray-200/20 shadow-sm overflow-hidden cursor-pointer group"
    >
        <Link href={`/projects/${project._id}`}>
            <div className="aspect-square flex items-center justify-center p-4">
                <motion.div
                    className="w-full h-full relative rounded-2xl overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <Image
                        src={project.banner_image?.[0] || '/placeholder.jpg'}
                        alt={project.name}
                        width={300}
                        height={300}
                        className="object-cover w-full h-[50vh] transition-transform duration-500"
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
                        {project.name}
                    </span>
                    <span className="text-gray-400 text-xs uppercase tracking-wider">
                        {project.location}
                    </span>
                </div>
            </motion.div>
        </Link>
    </motion.div>
);

const ProjectShowcase = () => {
    const initialFilters = {
        page: 1,
        limit: 12,
        project_category: [],
        product_type: [],
        product_category: [],
        product_group: [],
        sort: 'asc'
    };

    const [filters, setFilters] = useState(initialFilters);
    const [activeFilter, setActiveFilter] = useState(null);
    const filtersContainerRef = useRef(null);

    // Data fetching hooks with proper error handling
    const { data: projectsResponse, isLoading: isLoadingProjects } = useProjects(filters);
    const { data: projectCategoriesData } = useProjectCategories();
    const { data: productTypesData } = useProductTypes();
    const { data: productCategoriesData } = useProductCategoriesNew();
    const { data: productGroupsData } = useProductGroups();

    // Extract data with proper fallbacks
    const projects = projectsResponse?.data.data || [];
    const projectCategories = projectCategoriesData?.data || [];
    const productTypes = productTypesData || [];
    const productCategories = productCategoriesData || [];
    const productGroups = productGroupsData || [];

    // Handle click outside to close dropdown - FIXED IMPLEMENTATION
    useEffect(() => {
        function handleClickOutside(event) {
            // Only do something if a filter is active
            if (activeFilter) {
                // Find the active button and dropdown elements
                const activeButtonElement = document.querySelector(`[data-filter="${activeFilter}"]`);
                const activeDropdownElement = document.querySelector(`[data-dropdown="${activeFilter}"]`);

                // Check if the clicked element is outside of both the button and dropdown
                const clickedOutside = activeButtonElement && 
                                      !activeButtonElement.contains(event.target) && 
                                      activeDropdownElement && 
                                      !activeDropdownElement.contains(event.target);
                
                // Close the dropdown if clicked outside
                if (clickedOutside) {
                    setActiveFilter(null);
                }
            }
        }

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);
        
        // Clean up
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeFilter]);

    useEffect(() => {
        console.log('Projects Response:', projectsResponse);
        console.log('Project Categories:', projectCategories);
        console.log('Product Types:', productTypes);
        console.log('Product Categories:', productCategories);
        console.log('Product Groups:', productGroups);
    }, [projectsResponse, projectCategories, productTypes, productCategories, productGroups]);

    useEffect(() => {
        console.log('Current Filters:', filters);
        console.log('Categories:', productCategories);
    }, [filters, productCategories]);

    // Filter handlers
    const handleFilterChange = (filterType, optionId) => {
        setFilters(prev => {
            const updatedFilters = {
                ...prev,
                [filterType]: prev[filterType].includes(optionId)
                    ? prev[filterType].filter(id => id !== optionId)
                    : [...prev[filterType], optionId],
                page: 1 // Reset page when filter changes
            };
            console.log('Updated Filters:', updatedFilters);
            return updatedFilters;
        });
    };

    // Clear specific filter
    const handleClearFilter = (filterType, optionId) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType].filter(id => id !== optionId),
            page: 1
        }));
    };

    // Clear all filters
    const handleClearAllFilters = () => {
        setFilters(initialFilters);
        setActiveFilter(null);
    };

    // Filter configuration
    const filterConfig = [
        {
            type: 'project_category',
            label: 'Project Categories',
            options: projectCategories,
            loading: !projectCategoriesData
        },
        {
            type: 'product_type',
            label: 'Product Types',
            options: productTypes,
            loading: !productTypesData
        },
        {
            type: 'product_category',
            label: 'Product Categories',
            options: productCategories,
            loading: !productCategoriesData
        },
        {
            type: 'product_group',
            label: 'Product Family',
            options: productGroups,
            loading: !productGroupsData
        }
    ];

    // Create lookup maps for names
    const getFilterName = (filterType, id) => {
        const optionsMap = {
            project_category: projectCategories,
            product_type: productTypes,
            product_category: productCategories,
            product_group: productGroups
        };
        const option = optionsMap[filterType]?.find(opt => opt._id === id);
        return option?.name || id;
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-medium">Projects</h1>
                <span className="px-3 py-1 text-sm rounded-full border border-white/20">
                    {`${projects.length || 0} Products`}
                </span>
            </div>
            {/* Filters Section */}
            <div className="sticky top-0 z-20 bg-black/95 backdrop-blur-sm border-b border-white/10">
                <div className="py-4 flex flex-wrap gap-3" ref={filtersContainerRef}>
                    {filterConfig.map(({ type, label, options, loading }) => (
                        <div key={type} className="relative">
                            <FilterButton
                                label={label}
                                count={filters[type].length}
                                isActive={activeFilter === type}
                                onClick={() => setActiveFilter(activeFilter === type ? null : type)}
                                isLoading={loading}
                                dataFilter={type}
                            />
                            <FilterDropdown
                                options={options?.map(item => ({
                                    id: item._id,
                                    name: item.name
                                })) || []}
                                selectedValues={filters[type]}
                                onChange={(id) => handleFilterChange(type, id)}
                                isOpen={activeFilter === type}
                                filterType={type}
                            />
                        </div>
                    ))}
                </div>

                {/* Active Filters */}
                <div className="flex flex-wrap items-center gap-2 py-2">
                    {Object.entries(filters)
                        .filter(([key, value]) => Array.isArray(value) && value.length > 0)
                        .map(([filterType, ids]) =>
                            ids.map(id => (
                                <div
                                    key={`${filterType}-${id}`}
                                    className="bg-white/10 text-white px-3 py-1 rounded-full flex items-center gap-2"
                                >
                                    <span>{getFilterName(filterType, id)}</span>
                                    <button
                                        onClick={() => handleClearFilter(filterType, id)}
                                        className="hover:text-red-400"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    {Object.values(filters).some(arr => Array.isArray(arr) && arr.length > 0) && (
                        <button
                            onClick={handleClearAllFilters}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            {/* Projects Grid */}
            <div className="container mx-auto py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {isLoadingProjects ? (
                        // Loading skeleton
                        Array.from({ length: 8 }).map((_, idx) => (
                            <div key={idx} className="animate-pulse rounded-3xl border border-gray-200/20 overflow-hidden">
                                <div className="aspect-square bg-gray-800" />
                                <div className="p-8 space-y-4">
                                    <div className="h-4 bg-gray-700 rounded w-2/3 mx-auto" />
                                    <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto" />
                                </div>
                            </div>
                        ))
                    ) : projects.length === 0 ? (
                        <div className="col-span-full flex items-center justify-center py-12">
                            <p className="text-gray-500">No projects found</p>
                        </div>
                    ) : (
                        projects?.map((project) => (
                            <ProjectCard key={project._id} project={project} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectShowcase;