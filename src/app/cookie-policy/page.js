
// Cookie Policy Page (app/cookie-policy/page.js)
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { cookieAPI } from '@/lib/api-client';
import Common from '@/components/Common';

const CookiePolicyPage = () => {
  const { data: cookieResponse, isLoading } = useQuery({
    queryKey: ['cookie'],
    queryFn: () => cookieAPI.get(),
    select: (response) => response?.data || null
  });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full mx-auto md:py-32 py-16 text-white">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-600 rounded w-1/4 mb-4 md:px-6 px-4"></div>
          <div className="h-40 bg-gray-600 rounded w-full md:px-40 mx-auto px-4 py-16"></div>
        </div>
      </div>
    );
  }

  const cookieData = {
    name: cookieResponse?.title || 'Cookie Policy',
    content: cookieResponse?.content || 'Content not available'
  };

  return <Common data={cookieData} />;
};

export default CookiePolicyPage;

