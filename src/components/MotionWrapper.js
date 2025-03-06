// components/MotionWrapper.js
'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion";

export default function MotionWrapper({ children }) {
  useEffect(() => {
    // Add smooth scrolling CSS
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }
      body {
        overscroll-behavior-y: none;
      }
    `;
    document.head.appendChild(style);

    // Custom wheel event handler for more controlled scrolling
    const handleWheel = (e) => {
      // Check if the target or its parents have a scrollbar
      const isScrollable = (element) => {
        const style = window.getComputedStyle(element);
        return (
          element.scrollHeight > element.clientHeight &&
          (style.overflowY === 'scroll' || style.overflowY === 'auto')
        );
      };

      let target = e.target;
      while (target && target !== document.body) {
        if (isScrollable(target)) {
          // If in a scrollable element, let it handle scrolling
          return;
        }
        target = target.parentElement;
      }

      // Optional: add custom smooth scrolling logic
      // window.scrollBy({
      //   top: e.deltaY,
      //   behavior: 'smooth'
      // });
    };

    // Add wheel event listener
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Cleanup
    return () => {
      document.head.removeChild(style);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}