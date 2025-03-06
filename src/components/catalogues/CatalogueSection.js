'use client'
import React from 'react';
import { Download, Eye, FileText } from 'lucide-react';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { catalogueAPI } from '@/lib/api-client';

const CatalogueSection = () => {


    const { data: catalogues = [] } = useQuery({
        queryKey: ['catalogues'],
        queryFn: catalogueAPI.getAll,
        select: (response) => response?.data || []
    });

    // Filter featured catalogue and regular catalogues
    const featuredCatalogue = catalogues.find(cat => cat.isFeatured) || {
        title: "Main Catalogue",
        subtitle: "Experience our comprehensive collection of products and solutions.",
        image_url: "/hero1.jpg",
        file_url: "#",
    };

    const regularCatalogues = catalogues.filter(cat => !cat.isFeatured);

    const handleDownload = (fileUrl, fileName) => {
        if (!fileUrl) return;
        window.open(fileUrl, '_blank');
    };

    const handlePreview = (fileUrl) => {
        if (!fileUrl) return;
        window.open(fileUrl, '_blank');
    };

    return (
        <div className={`min-h-screen text-white`}>
            <h1 className="text-4xl mb-6">Catalogue</h1>

            {/* Featured Catalogue Section */}
            <div className={`rounded-xl overflow-hidden mb-16 p-3 md:p-5 bg-zinc-900`}>
                <div className="md:flex justify-between">
                    <div className="md:w-1/3 flex justify-center items-center">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">{featuredCatalogue.title}</h2>
                            <p className={`mb-8 text-gray-300`}>
                                {featuredCatalogue.subtitle}
                            </p>
                            <div className="flex space-x-4">
                                <button 
                                    onClick={() => handlePreview(featuredCatalogue.file_url)}
                                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <Eye size={20} />
                                </button>
                                <button 
                                    onClick={() => handleDownload(featuredCatalogue.file_url, featuredCatalogue.title)}
                                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <Download size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/3">
                        <Image
                            src={featuredCatalogue.image_url}
                            alt={featuredCatalogue.title}
                            width={400} height={400}
                            className="object-cover h-[50vh] rounded-lg w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Regular Catalogues Grid */}
            <div className="space-y-8">
                <h2 className="text-2xl">All Catalogues</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularCatalogues.map((catalogue) => (
                        <div
                            key={catalogue._id}
                            className={`relative group rounded-xl overflow-hidden h-[60vh] bg-zinc-900`}
                        >
                            <Image
                                src={catalogue.image_url}
                                alt={catalogue.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />

                            {/* Overlay with buttons and file info */}
                            <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/60 via-black/0 to-black/0">
                                <div>
                                    <h3 className="text-white text-lg font-medium">{catalogue.title}</h3>
                                    <div className="flex items-center mt-2 text-white/80 text-sm">
                                        <FileText size={16} className="mr-2" />
                                        <span>{catalogue.subtitle}</span>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button 
                                        onClick={() => handlePreview(catalogue.file_url)}
                                        className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                                    >
                                        <Eye size={20} className="text-white" />
                                    </button>
                                    <button 
                                        onClick={() => handleDownload(catalogue.file_url, catalogue.title)}
                                        className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                                    >
                                        <Download size={20} className="text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CatalogueSection;