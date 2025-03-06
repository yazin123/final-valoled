'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { aboutAPI } from '@/lib/api-client';
import Common from '@/components/Common';

const AboutPage = () => {
  const { data: aboutResponse, isLoading, error } = useQuery({
    queryKey: ['about'],
    queryFn: aboutAPI.getAll,
    select: (response) => response?.data?.[0] || null
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-[300px] bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-40 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>Failed to load about content. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!aboutResponse) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded" role="alert">
          <p>No about content is currently available.</p>
        </div>
      </div>
    );
  }

  const aboutData = {
    name: aboutResponse.title,
    image: aboutResponse.image_url || '/hero3.jpg', // Fallback image
    content: aboutResponse.content
  };

  return <Common data={aboutData} />;
};

export default AboutPage;