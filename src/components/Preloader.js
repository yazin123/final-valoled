'use client'
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const PageTransition = ({ children }) => {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setIsAnimating(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsAnimating(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div className="min-h-screen">
      {/* Main overlay with grid effect - Lower z-index */}
      <div 
        className={`fixed inset-0 z-20 bg-black transition-transform duration-800 ease-out ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Animated grid lines */}

      </div>

      {/* Page content with fade effect */}
      <div
        className="transform transition-all duration-500 ease-out"
        style={{
          opacity: isAnimating ? 0 : 1,
          filter: `blur(${isAnimating ? '8px' : '0'})`,
          transform: `scale(${isAnimating ? 0.95 : 1})`
        }}
      >
        {displayChildren}
      </div>

      {/* Corner accents - Lower z-index */}
      <div className={`fixed inset-0 z-10 pointer-events-none ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}>
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((position, i) => (
          <div
            key={`corner-${i}`}
            className={`absolute w-8 h-8 ${position}`}
            style={{
              opacity: isAnimating ? 1 : 0,
              transition: `opacity 400ms ease-out ${i * 100}ms`,
            }}
          >
            <div className="absolute w-full h-px bg-blue-500/50" />
            <div className="absolute w-px h-full bg-blue-500/50" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageTransition;