'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { researchAPI } from '@/lib/api-client';
import Common from '@/components/Common';
import Image from 'next/image';
import Link from 'next/link';

const ResearchDevelopmentPage = () => {
    // Fetch main page content
    const { data: pageContent, isLoading: isPageLoading } = useQuery({
        queryKey: ['research-page'],
        queryFn: researchAPI.getPage,
        select: (response) => response?.data || null
    });

    // Fetch all R&D items
    const { data: researchItems, isLoading: isItemsLoading } = useQuery({
        queryKey: ['research-items'],
        queryFn: researchAPI.getAll,
        select: (response) => response?.data || []
    });

    if (isPageLoading || isItemsLoading) {
        return (
            <div className="min-h-screen w-full mx-auto md:py-32 py-16 text-white">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-600 rounded w-1/4 mb-4 md:px-6 px-4"></div>
                    <div className="h-[60vh] bg-gray-600 rounded w-full mt-4"></div>
                    <div className="h-40 bg-gray-600 rounded w-full md:px-40 mx-auto px-4 py-16"></div>
                </div>
            </div>
        );
    }

    // Data for the hero section using Common component
    const pageData = {
        name: pageContent?.title || 'Research & Development',
        image: pageContent?.image_url,
        content: pageContent?.subtitle
    };

    return (
        <>
            {/* Hero Section */}
            <Common data={pageData} />

            {/* Research Items Section */}
            {researchItems && researchItems.length > 0 && (
                <div className="w-full bg-black text-white py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {researchItems.map((item) => (
                                <Link
                                    href={`/research-development/${item._id}`}
                                    key={item._id}
                                    className="bg-gray-900 rounded-lg overflow-hidden transform transition-transform hover:scale-105"
                                >
                                    <div className="group cursor-pointer">
                                        {item.media_url && (
                                            <div className="relative w-full h-48">
                                                <Image
                                                    src={item.media_url}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400">
                                                {item.title}
                                            </h3>
                                            {item.subtitle && (
                                                <p className="text-gray-400 mb-3">{item.subtitle}</p>
                                            )}
                                            <div
                                                className="text-gray-300 line-clamp-3"
                                                dangerouslySetInnerHTML={{ __html: item.content }}
                                            />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ResearchDevelopmentPage;