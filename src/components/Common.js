'use client';

import Image from 'next/image';
import React from 'react';

const Common = ({ data }) => {
    if (!data) {
        return (
            <div className="min-h-screen w-full mx-auto md:py-32 py-16 text-white">
                <div className="md:px-6 px-4">
                    <h1 className="text-5xl">Content Not Available</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full mx-auto md:py-32 py-16 text-white">
            <div className="md:px-6 px-4">
                <h1 className="text-4xl">{data.name}</h1>
            </div>

            {data.image && (
                <div className="relative w-full h-[60vh] mt-4">
                    <Image
                        src={data.image}
                        alt={data.name}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                    />
                </div>
            )}

            {data.content && (
                <div 
                    className="w-full md:px-40 mx-auto px-4 py-16"
                    dangerouslySetInnerHTML={{ __html: data.content }}
                />
            )}
        </div>
    );
};

export default Common;