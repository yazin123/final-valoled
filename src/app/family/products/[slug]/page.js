'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

import { useProductDetail } from '@/hooks/api-hooks';
import { SpecItem } from '@/components/products/slug/SpecItem';
import { SpecSheet } from '@/components/products/slug/SpecSheet';
import { DownloadResources } from '@/components/products/slug/DownloadResources';
import { AccessoriesSection } from '@/components/products/slug/AccessoriesSection';

const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-8">
        <div className="h-8 w-32 bg-gray-700 rounded" />
        <div className="grid md:grid-cols-2 gap-12">
            <div className="h-[50vh] bg-gray-700 rounded" />
            <div className="space-y-4">
                <div className="h-8 w-48 bg-gray-700 rounded" />
                <div className="h-24 bg-gray-700 rounded" />
            </div>
        </div>
    </div>
);

const ErrorDisplay = ({ message }) => (
    <div className="min-h-screen flex items-center justify-center text-red-500">
        {message}
    </div>
);

const ProductDetail = () => {
    const params = useParams();
    const [isSpecSheetOpen, setIsSpecSheetOpen] = useState(false);
    const [selectedSpecs, setSelectedSpecs] = useState({});
    const [selectedSpecCodes, setSelectedSpecCodes] = useState({});
    const [fullProductCode, setFullProductCode] = useState('');

    // Fetch product data
    const { data: productResponse, isLoading: productLoading, error: productError } = useProductDetail(params.slug);
    const product = productResponse?.data;
    const productSpecs = product?.specifications || [];

    // Initialize selected specs when product specifications are loaded
    useEffect(() => {
        if (productSpecs.length > 0) {
            const initialSpecs = productSpecs.reduce((acc, spec) => {
                acc[spec.name] = '';
                return acc;
            }, {});
            const initialSpecCodes = productSpecs.reduce((acc, spec) => {
                acc[spec.name] = '';
                return acc;
            }, {});
            setSelectedSpecs(initialSpecs);
            setSelectedSpecCodes(initialSpecCodes);
        }
    }, [productSpecs]);

    // Update full product code when specs change
    useEffect(() => {
        if (product) {
            let codeString = product.code || '';
            
            // Add all selected spec codes to the product code
            const specCodes = Object.values(selectedSpecCodes).filter(code => code !== '');
            
            if (specCodes.length > 0) {
                codeString += ' ' + specCodes.join(' ');
            }
            
            setFullProductCode(codeString);
        }
    }, [product, selectedSpecCodes]);

    const handleSpecChange = (specName, selectedSpec) => {
        const isAlreadySelected = selectedSpecs[specName] === selectedSpec.spec;
        
        setSelectedSpecs(prev => ({
            ...prev,
            [specName]: isAlreadySelected ? '' : selectedSpec.spec
        }));
        
        setSelectedSpecCodes(prev => ({
            ...prev,
            [specName]: isAlreadySelected ? '' : (selectedSpec.code || '')
        }));
    };

    const handleDownload = async (resource) => {
        if (!resource.fileUrl) return;
        window.open(resource.fileUrl, '_blank');
    };

    if (productLoading) return <LoadingSkeleton />;
    if (productError) return <ErrorDisplay message={productError.message} />;
    if (!product) return <ErrorDisplay message="Product not found" />;

    const hasSelectedSpecs = Object.values(selectedSpecs).some(value => value !== '');

    return (
        <div className="min-h-screen w-full md:px-6 mx-auto px-4 md:py-32 py-16 text-white">
            {/* Back Button */}
            <div className="mb-8">
                <Link
                    href="/family"
                    className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/5"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>All Products</span>
                </Link>
            </div>

            <div className="mx-auto">
                {/* Product Header */}
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left Side - Image */}
                    <div>
                        <div className="h-[50vh] relative bg-white/5 rounded-lg overflow-hidden">
                            <Image
                                src={product.imageUrl || '/placeholder.jpg'}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Right Side - Product Info */}
                    <div>
                        <h1 className="text-3xl font-medium mb-3">{product.name}</h1>
                        <div className="mb-4">
                            <span className="text-sm opacity-60">Product Code:</span>
                            <span className="ml-2">{fullProductCode || product.code || 'N/A'}</span>
                        </div>
                        <div className="md:flex flex-wrap gap-4 mb-8">
                            <button
                                onClick={() => setIsSpecSheetOpen(true)}
                                disabled={!hasSelectedSpecs}
                                className={`px-4 py-2 w-full md:w-auto mb-2 rounded-lg text-white 
                                    ${hasSelectedSpecs ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                            >
                                Specification Sheet
                            </button>
                        </div>
                    </div>
                </div>

                {/* Specifications Grid */}
                {productSpecs.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-xl font-medium mb-8">Specifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {productSpecs.map((spec) => (
                                <SpecItem
                                    key={spec.id}
                                    title={spec.name}
                                    specifications={spec.specifications}
                                    selectedSpecs={spec.selected_specs}  // Available specs for this product
                                    userSelected={selectedSpecs[spec.name] || ''}  // User's selections
                                    onChange={(selectedSpec) => {
                                        handleSpecChange(spec.name, selectedSpec);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {/* Configuration Section */}

                {product.accessories && product.accessories.length > 0 && (
                    <AccessoriesSection accessories={product.accessories} />
                )}


                {/* Downloads Section */}
                {product.resources && product.resources.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-xl font-medium mb-8">Downloads and Resources</h2>
                        <DownloadResources
                            resources={product.resources}
                            handleDownload={handleDownload}
                        />
                    </div>
                )}
            </div>

            {/* Spec Sheet Modal */}
            <SpecSheet
                isOpen={isSpecSheetOpen}
                onClose={() => setIsSpecSheetOpen(false)}
                product={product}
                selectedSpecs={selectedSpecs}
                selectedSpecCodes={selectedSpecCodes}
                fullProductCode={fullProductCode}
            />
        </div>
    );
};

export default ProductDetail;