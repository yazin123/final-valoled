// components/SmoothScroll.js
'use client'
import React, { useEffect } from 'react'

const SmoothScroll = ({ children }) => {
    useEffect(() => {
        // Smooth scrolling implementation
        const smoothScroll = (target, duration) => {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            let startTime = null;

            const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }

            // Easing function for smooth acceleration and deceleration
            const ease = (t, b, c, d) => {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(animation);
        }

        // Wheel event handler for smooth scrolling
        const handleWheel = (event) => {
            // Prevent default scrolling
            event.preventDefault();

            // Smooth scroll
            window.scrollBy({
                top: event.deltaY,
                behavior: 'smooth'
            });
        }

        // Add wheel event listener
        window.addEventListener('wheel', handleWheel, { passive: false });

        // Add CSS for smoother scrolling
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

        // Cleanup
        return () => {
            window.removeEventListener('wheel', handleWheel);
            document.head.removeChild(style);
        }
    }, []);

    return <>{children}</>;
}

export default SmoothScroll;