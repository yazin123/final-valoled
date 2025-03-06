'use client'
import NewsShowcase from '@/components/news/NewsShowcase'
import React from 'react'


const page = () => {

    return (
        <div className={`min-h-screen w-full md:px-6 mx-auto px-4 md:py-32 py-16  text-white`}  >
            <NewsShowcase />
        </div>
    )
}

export default page
