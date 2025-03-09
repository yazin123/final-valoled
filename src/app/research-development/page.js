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

    const isVideo = (url) => {
        if (!url) return false;
        return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
    };

    return (
        <>
            {/* Hero Section */}
            <Common data={pageData} />

            {/* Research Items Section */}
            {researchItems && researchItems.length > 0 && (
                <div className="min-h-screen w-full md:px-6 mx-auto px-4 text-white">
                    <div className=" ">
                        <div className="space-y-24">
                            {researchItems.map((item) => (
                                <div 
                                    key={item._id}
                                    className="flex flex-col lg:flex-row gap-8 items-start "
                                >
                                    {/* Content Section */}
                                    <div className="w-full lg:w-2/6 md:pr-32 pt-5">
                                        <h2 className="text-3xl  font-semibold uppercase mb-4">
                                            {item.title}
                                        </h2>
                                        {item.subtitle && (
                                            <p className="text-lg font-semibold text-gray-100 mb-4">{item.subtitle}</p>
                                        )}
                                        <div 
                                            className="text-gray-300 text-sm  prose prose-invert max-w-none"
                                            dangerouslySetInnerHTML={{ __html: item.content }}
                                        />
                                        {/* <Link
                                            href={`/research-development/${item._id}`}
                                            className="inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                        >
                                            Learn More
                                        </Link> */}
                                    </div>

                                    {/* Media Section */}
                                    <div className="w-full lg:w-4/6 md:h-[83vh] relative border border-white/50 rounded-lg">
                                        {isVideo(item.media_url) ? (
                                            <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
                                                <video 
                                                    src={item.media_url} 
                                                    className="w-full h-full object-cover" 
                                                    controls
                                                    playsInline
                                                    autoPlay
                                                    muted
                                                    loop
                                                />
                                            </div>
                                        ) : item.media_url ? (
                                            <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
                                                <Image
                                                    src={item.media_url}
                                                    alt={item.title || "Research and development"}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, 60vw"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
                                                <span className="text-gray-400">No media available</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}


        </>
    );
};

export default ResearchDevelopmentPage;