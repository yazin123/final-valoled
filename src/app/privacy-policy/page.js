'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { privacyAPI } from '@/lib/api-client';
import Common from '@/components/Common';

const PrivacyPolicyPage = () => {
  const { data: privacyResponse, isLoading } = useQuery({
    queryKey: ['privacy'],
    queryFn: () => privacyAPI.get(),
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

  const privacyData = {
    name: privacyResponse?.title || 'Privacy Policy',
    content: privacyResponse?.content || 'Content not available'
  };

  return <Common data={privacyData} />;
};

export default PrivacyPolicyPage;
