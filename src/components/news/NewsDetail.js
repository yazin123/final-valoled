'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';


const NewsDetail = ({ news }) => {
    const newsData = news

    return (
        <div>
            {/* Back Button */}
            <div className="md:px-6 px-4 mb-10">
                <Link href="/news"
                    className={`inline-flex items-center px-4 py-2 space-x-2 rounded-lg 
                        border border-white/50 text-white hover:bg-black/70
                        backdrop-blur-md transition-colors`}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>All News</span>
                </Link>
            </div>

            {/* Hero Image Section */}
            <div className="">
                <div className=" md:px-6 px-4 md:flex justify-between items-end">
                    <h1 className={` text-4xl font-bold text-white`}>
                        {newsData.title}
                    </h1>
                    <span className={` text-white`}>
                        {newsData.date}
                    </span>
                </div>
                <Image
                    src={newsData.image_url}
                    alt={newsData.title}
                    width={400} height={400}
                    className="object-cover w-[100vw] h-[60vh] mt-4"

                />

            </div>

            <div className="md:px-40  px-4 py-3 mx-auto">
            <div className={`prose max-w-none prose-invert`}
                            dangerouslySetInnerHTML={{ __html: newsData.content }}>
                        </div>
            
            </div>
        </div>
    );
};

export default NewsDetail;