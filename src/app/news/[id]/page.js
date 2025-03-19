'use client'

import React from 'react'

import NewsDetail from '@/components/news/NewsDetail'
import { useNewsArticle } from '@/hooks/api-hooks'
import { useParams } from 'next/navigation'

const NewsDetailPage = () => {

    const params = useParams();
    const { data: newsData, isLoading, error } = useNewsArticle(params.id);

    if (isLoading) {
        return (
            <div className={`min-h-screen w-full mx-auto md:py-32 py-16 text-white`}>
                <div className="flex justify-center items-center h-[60vh]">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-current"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen w-full mx-auto md:py-32 py-16 text-white`}>
                <div className="mx-auto max-w-2xl px-4">
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
                        Failed to load news article. Please try again later.
                    </div>
                </div>
            </div>
        );
    }

    if (!newsData) {
        return (
            <div className={`min-h-screen w-full mx-auto md:py-32 py-16 text-white`}>
                <div className="mx-auto max-w-2xl px-4">
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4">
                        News article not found.
                    </div>
                </div>
            </div>
        );
    }
    console.log("newsdata: ", newsData)

    // Transform the API data to match the expected props structure
    const formattedNews = {
        title: newsData.data.title,
        content: newsData.data.content,
        image_url: newsData.data.image_url,
        postedDate: newsData.data.postedDate,
       
    };

    return (
        <div className={`min-h-screen w-full mx-auto md:pt-32 pt-16  text-white`}>
            <NewsDetail news={formattedNews} />
        </div>
    );
};

export default NewsDetailPage;