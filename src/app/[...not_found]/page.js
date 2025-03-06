'use client'
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const NotFound = () => {
  // Animation variants for the SVG paths
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
      }
    }
  };

  // Animation for content fade-in
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1,
        duration: 0.8
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black dark:bg-black">
      {/* SVG Animation Container */}
      <div className="w-full max-w-md mb-8">
        <motion.svg
          viewBox="0 0 400 200"
          initial="hidden"
          animate="visible"
          className="w-full h-auto stroke-white dark:stroke-white"
        >
          {/* "404" Text Path */}
          <motion.path
            d="M 50 100 L 50 50 L 50 150 M 20 100 L 80 100"  // "4"
            variants={pathVariants}
            fill="none"
            strokeWidth="2"
          />
          <motion.circle  // "0"
            cx="150"
            cy="100"
            r="40"
            variants={pathVariants}
            fill="none"
            strokeWidth="2"
          />
          <motion.path
            d="M 250 100 L 250 50 L 250 150 M 220 100 L 280 100"  // "4"
            variants={pathVariants}
            fill="none"
            strokeWidth="2"
          />
          
          {/* Decorative Lines */}
          <motion.path
            d="M 320 80 L 380 120"
            variants={pathVariants}
            fill="none"
            strokeWidth="1"
          />
          <motion.path
            d="M 320 120 L 380 80"
            variants={pathVariants}
            fill="none"
            strokeWidth="1"
          />
        </motion.svg>
      </div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-4 text-white dark:text-white">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
        >
          Return Home
        </Link>
      </motion.div>

      {/* Background Animation */}
      <motion.div
        className="fixed inset-0 -z-10 opacity-5"
        initial={{ backgroundPosition: '0% 0%' }}
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
          transition: { 
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse"
          }
        }}
        style={{
          backgroundImage: 'radial-gradient(circle at center, #000 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
};

export default NotFound;