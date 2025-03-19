import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, Play } from 'lucide-react';

import { useProject } from '@/hooks/api-hooks';

const LoadingSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-8 w-32 bg-gray-700 rounded mb-10" />
        <div className="h-12 w-64 bg-gray-700 rounded mb-4" />
        <div className="h-[60vh] bg-gray-700 rounded mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="h-96 bg-gray-700 rounded" />
            <div className="md:col-span-2 space-y-4">
                <div className="h-8 w-48 bg-gray-700 rounded" />
                <div className="h-32 bg-gray-700 rounded" />
            </div>
        </div>
    </div>
);

// Function to check if a file is a video based on extension
const isVideo = (url) => {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.wmv', '.flv', '.mkv'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

// Media item component that renders either an image or video
const MediaItem = ({ src, alt, className, desktopView = false }) => {
    if (isVideo(src)) {
        return (
            <div className={`relative ${className}`}>
                <video 
                    src={src}
                    controls
                    className="w-full h-full object-cover"
                    poster="/video-placeholder.jpg"
                />
                {desktopView && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="w-12 h-12 text-white" />
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <div className={`relative ${className}`}>
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
            />
        </div>
    );
};

const ProjectDetail = ({ projectId }) => {
   
    const { data: projectResponse, isLoading, error } = useProject(projectId);

    const project = projectResponse?.data;

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-red-500">Error loading project: {error.message}</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Project not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Back Button */}
            <div className="mb-10 md:px-6 px-4">
                <Link
                    href="/projects"
                    className={`inline-flex items-center px-4 py-2 space-x-2 rounded-lg 
                        transform transition-all duration-200 hover:scale-105 active:scale-95
                       border border-white/50 text-white hover:bg-white/10
                        backdrop-blur-md`}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>All Projects</span>
                </Link>
            </div>

            {/* Hero Section */}
            <div className="relative">
                <div className="md:px-6 px-4 flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-4">
                    <h1 className={`text-4xl font-bold text-white`}>
                        {project.name}
                    </h1>
                    <span className='text-gray-300' >
                        {project.location}
                    </span>
                </div>
                <div className="relative w-full h-[60vh]">
                    {isVideo(project.banner_image?.[0]) ? (
                        <video 
                            src={project.banner_image?.[0]} 
                            alt={project.name} 
                            autoPlay 
                            muted 
                            loop 
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Image
                            src={project.banner_image?.[0] || '/placeholder.jpg'}
                            alt={project.name}
                            fill
                            priority
                            className="object-cover"
                        />
                    )}
                </div>
            </div>

            {/* Project Details */}
            <div className="md:px-6 px-4  pt-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Left Column - Project Info */}
                    <div className={`space-y-6 p-6 rounded-lg transition-colors
                      bg-white/5 border border-white/10`}
                    >
                        {project.associated_product && (
                            <div className="space-y-2">
                                <h3 className={`text-sm font-medium text-gray-400`}>
                                    PRODUCTS
                                </h3>
                                <p className="text-lg">
                                    {project.associated_product.name}
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <h3 className={`text-sm font-medium text-gray-400`}>
                                LOCATION
                            </h3>
                            <p className="text-lg">{project.location}</p>
                        </div>

                        <div className="space-y-2">
                            <h3 className={`text-sm font-medium text-gray-400`}>
                                PROJECT
                            </h3>
                            <p className="text-lg">{project.name}</p>
                        </div>

                        {project.architect && (
                            <div className="space-y-2">
                                <h3 className={`text-sm font-medium text-gray-400`}>
                                    CREDITS
                                </h3>
                                <p className="text-lg">{project.architect}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Project Description */}
                    <div className="md:col-span-2">
                        <div className={`prose max-w-none prose-invert`}
                            dangerouslySetInnerHTML={{ __html: project.description }}>
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Image and Video Gallery */}
            {project.media_resource && project.media_resource.length > 0 && (
                <div className="mt-16 md:px-6 px-4">
                    {/* Desktop View - Horizontal Scroll with Hover Expand */}
                    <div className="hidden md:flex space-x-4 overflow-x-auto pb-8">
                        {project.media_resource.map((media, index) => (
                            <div
                                key={index}
                                className="relative flex-shrink-0 w-[20%] hover:w-[60%] 
                                    transition-all duration-500 ease-in-out cursor-pointer h-[400px]"
                            >
                                <div className="w-full h-full overflow-hidden rounded-lg">
                                    <MediaItem 
                                        src={media} 
                                        alt={`${project.name} media ${index + 1}`}
                                        className="w-full h-full"
                                        desktopView={true}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile View - Grid */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {project.media_resource.map((media, index) => (
                            <div
                                key={index}
                                className="relative w-full aspect-[4/3] rounded-lg overflow-hidden"
                            >
                                <MediaItem 
                                    src={media} 
                                    alt={`${project.name} media ${index + 1}`}
                                    className="w-full h-full"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;