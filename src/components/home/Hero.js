'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { bannerAPI } from '@/lib/api-client';

const HeroSection = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await bannerAPI.getAll();
                setBanners(response.filter(banner => banner.active));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching banners:', error);
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length === 0) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                prevIndex === banners.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(timer);
    }, [banners]);

    const handleDiscoverClick = (link) => {
        if (link === '#') {
            const windowHeight = window.innerHeight;
            const scrollTarget = windowHeight * 0.5;
            window.scrollTo({
                top: scrollTarget,
                behavior: 'smooth'
            });
        } else if (link) {
            window.location.href = link;
        }
    };

    if (loading) {
        return <div className="h-screen w-full bg-black flex items-center justify-center">
            <div className="text-white">Loading...</div>
        </div>;
    }

    if (banners.length === 0) {
        return null;
    }

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ 
                        opacity: 1, 
                        scale: 1,
                        transition: {
                            duration: 1.5,
                            ease: [0.4, 0, 0.2, 1]
                        }
                    }}
                    exit={{ 
                        opacity: 0,
                        transition: {
                            duration: 0.8,
                            ease: [0.4, 0, 1, 1]
                        }
                    }}
                    className="absolute inset-0"
                >
                    <div 
                        className="absolute inset-0 bg-cover bg-center transform-gpu"
                        style={{ 
                            backgroundImage: `url(${banners[currentIndex]?.media_url})`,
                        }}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </motion.div>
            </AnimatePresence>

            <div className="relative z-10 h-full flex flex-col items-start justify-end pb-32 px-4 sm:px-6 lg:px-8">
                <div className="text-left">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-4xl sm:text-5xl md:text-6xl text-white mb-6"
                    >
                        {banners[currentIndex]?.title}
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-lg sm:text-xl text-gray-200 mb-8 max-w-3xl"
                    >
                        {banners[currentIndex]?.subtitle}
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        {banners[currentIndex]?.button && (
                            <motion.button
                                onClick={() => handleDiscoverClick(banners[currentIndex].button.link)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3 bg-white text-black rounded-lg font-medium hover:bg-blue-700 hover:text-white transition-colors"
                            >
                                {banners[currentIndex].button.text}
                            </motion.button>
                        )}
                    </motion.div>
                </div>
            </div>

            {banners.length > 1 && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                    {banners.map((_, index) => (
                        <motion.button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 rounded-full transition-all duration-500 ${
                                index === currentIndex 
                                    ? 'bg-white w-8' 
                                    : 'bg-white/50 w-2 hover:bg-white/75'
                            }`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroSection;