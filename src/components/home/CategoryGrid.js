'use client'
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productAPI } from '@/lib/api-client';

const CategoryGrid = () => {
    const router = useRouter();
    
    const { data: productTypes, isLoading } = useQuery({
        queryKey: ['productTypes'],
        queryFn: productAPI.getTypes,
        select: (response) => {
            return response?.data?.map(type => ({
                id: type._id,
                title: type.name,
                image: type.image_url || '/placeholder.jpg',
                isFav: type.isFav // Make sure this field exists in your API response
            })) || [];
        }
    });

    const handleTypeSelect = (category) => {
        router.push(`/family?initialType=${encodeURIComponent(category.title)}`);
    };

    if (isLoading) {
        return (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                    <div key={index} className="h-[400px] bg-gray-200 animate-pulse" />
                ))}
            </div>
        );
    }

    // Filter products to only show favorites
    const displayProducts = productTypes?.filter(category => category.isFav) || [];

    return (
        <div className="w-full">
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {displayProducts.map((category) => (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div 
                            onClick={() => handleTypeSelect(category)}
                            className="cursor-pointer"
                        >
                            <motion.div
                                className="group relative h-[400px] overflow-hidden bg-gray-100"
                                whileHover="hover"
                            >
                                {/* Image */}
                                <motion.div
                                    className="absolute inset-0"
                                    variants={{
                                        hover: {
                                            scale: 1.05,
                                            transition: { duration: 0.3 }
                                        }
                                    }}
                                >
                                    <Image
                                        src={category.image}
                                        alt={category.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </motion.div>

                                {/* Overlay */}
                                <motion.div
                                    className="absolute inset-0 bg-black/40"
                                    variants={{
                                        hover: {
                                            opacity: 0.6,
                                            transition: { duration: 0.3 }
                                        }
                                    }}
                                />

                                {/* Content */}
                                <motion.div
                                    className="absolute inset-0 flex pl-6 pt-4"
                                    variants={{
                                        hover: {
                                            y: -10,
                                            transition: { duration: 0.3 }
                                        }
                                    }}
                                >
                                    <div className="text-center">
                                        <motion.h3
                                            className="text-2xl font-semibold text-white mb-2"
                                            variants={{
                                                hover: {
                                                    scale: 1.1,
                                                    transition: { duration: 0.3 }
                                                }
                                            }}
                                        >
                                            {category.title}
                                        </motion.h3>
                                        <motion.div
                                            className="w-12 h-1 bg-white mx-auto opacity-0"
                                            variants={{
                                                hover: {
                                                    opacity: 1,
                                                    width: '3rem',
                                                    transition: { duration: 0.3 }
                                                }
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default CategoryGrid;