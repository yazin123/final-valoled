'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { researchAPI } from '@/lib/api-client';
import Common from '@/components/Common';
import { notFound } from 'next/navigation';

const ResearchDetailPage = ({ params }) => {
  const { data: researchItem, isLoading } = useQuery({
    queryKey: ['research-detail', params.id],
    queryFn: () => researchAPI.getById(params.id),
    select: (response) => response?.data || null
  });

  if (isLoading) {
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

  if (!researchItem) {
    notFound();
  }

  const detailData = {
    name: researchItem.title,
    image: researchItem.media_url,
    content: `
      ${researchItem.subtitle ? `<h2 class="text-2xl mb-8">${researchItem.subtitle}</h2>` : ''}
      <div class="mt-4">${researchItem.content}</div>
    `
  };

  return <Common data={detailData} />;
};

export default ResearchDetailPage;