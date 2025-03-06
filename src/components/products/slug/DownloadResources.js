'use client'
import React from 'react';
import { ImageIcon, FileText, File, BookOpen, PenTool, Box, Cuboid, Download } from 'lucide-react';

export const DownloadResources = ({ resources }) => {
    const getResourceIcon = (iconName) => {
        const icons = {
            'image': <ImageIcon className="w-5 h-5" />,
            'document': <FileText className="w-5 h-5" />,
            'model': <Cuboid className="w-5 h-5" />,
            'file': <File className="w-5 h-5" />,
            'manual': <BookOpen className="w-5 h-5" />,
            'drawing': <PenTool className="w-5 h-5" />,
            'package': <Box className="w-5 h-5" />
        };
        return icons[iconName] || <File className="w-5 h-5" />;
    };

    // Handle file download
    const handleDownload = (resource) => {
        if (!resource.fileUrl) {
            console.error('No file URL available for download');
            return;
        }

        // Create an anchor element and trigger download
        const link = document.createElement('a');
        link.href = resource.fileUrl;
        
        // Extract filename from URL or use the resource title
        const filename = resource.fileName || 
                        resource.fileUrl.split('/').pop() || 
                        `${resource.title}.pdf`;
                        
        // Set download attribute with filename
        link.setAttribute('download', filename);
        
        // For files that should open in a new tab instead of downloading
        if (resource.openInNewTab) {
            link.setAttribute('target', '_blank');
        }
        
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {resources.map((resource) => (
                <button
                    key={resource._id}
                    onClick={() => handleDownload(resource)}
                    className={`p-4 rounded-lg text-left border transition-colors
                    border-white/20 hover:bg-white/5 flex flex-col gap-2 group`}
                >
                    <span className="flex items-center gap-2 justify-between">
                        <span className="flex items-center gap-2">
                            {getResourceIcon(resource.type)}
                            <span className="font-medium">{resource.title}</span>
                        </span>
                        <Download className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                    {resource.description && (
                        <span className="text-xs opacity-60">
                            {resource.description}
                        </span>
                    )}
                    {resource.fileSize && (
                        <span className="text-xs opacity-60">
                            {resource.fileSize}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};