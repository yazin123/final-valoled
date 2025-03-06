'use client'
import React, { useState, useEffect } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductMenu from './navbar/ProductMenu';
import { ContactModal } from './ContactModal';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [bottomNavPosition, setBottomNavPosition] = useState('bottom'); // 'bottom', 'top', 'hidden'

    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/family/products?name=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsSearchOpen(false);
        }
    };

    useEffect(() => {
        if (isMenuOpen) {
            setIsNavVisible(true);
            setBottomNavPosition('bottom');
        }
    }, [isMenuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollPercentage = (currentScrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

            if (currentScrollY > lastScrollY) {
                // Scrolling down
                if (isNavVisible) {
                    setBottomNavPosition('top'); // Move to top first
                    setTimeout(() => {
                        setIsNavVisible(false);
                        setBottomNavPosition('hidden');
                    }, 300);
                }
            } else {
                // Scrolling up
                setIsNavVisible(true);
                setBottomNavPosition('top');
                setTimeout(() => {
                    setBottomNavPosition('bottom');
                }, 50);
            }

            setIsScrolled(scrollPercentage > 1);
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, isNavVisible]);

    const menuItems = [
        { name: 'Products', href: '/family' },
        { name: 'Projects', href: '/projects' },
        { name: 'News', href: '/news' },
        { name: 'Catalogues', href: '/catalogues' },
        { name: 'About us', href: '/about' },
    ];

    // Bottom navbar animation variants
    const bottomNavVariants = {
        hidden: {
            y: -20,
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: 'easeInOut'
            }
        },
        top: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: 'easeInOut'
            }
        },
        bottom: {
            y: 0, // Height of top navbar
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: 'easeInOut'
            }
        }
    };

    // Mobile menu animation variants
    const mobileMenuVariants = {
        closed: {
            x: '100%',
            transition: {
                type: 'tween',
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
            }
        },
        open: {
            x: 0,
            transition: {
                type: 'tween',
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    useEffect(() => {
        const handleRouteChange = () => {
            setIsMenuOpen(false);
        };

        router.events?.on('routeChangeStart', handleRouteChange);
        return () => {
            router.events?.off('routeChangeStart', handleRouteChange);
        };
    }, [router]);

    return (
        <>
            <motion.nav
                initial="hidden"
                animate="visible"
                className="fixed top-0 left-0 right-0 z-50" style={{zIndex:"1000"}}
            >
                {/* Desktop Navigation */}
                <div className="hidden lg:block">
                    {/* Top navbar */}
                    <div className={`flex ${isMenuOpen || isScrolled ? 'bg-black' : 'bg-transparent'} transition-colors duration-300 `}>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex justify-center w-32 items-center text-sm font-semibold gap-3 rounded-lg text-white"
                        >
                            {isMenuOpen ? (
                                <><X className="h-5 w-5" /> Close</>
                            ) : (
                                <><Menu className="h-5 w-5" /> Menu</>
                            )}
                        </motion.button>

                        <div className="w-full px-8">
                            <div className="flex items-center justify-between h-16">
                                <div className="flex items-center gap-4">
                                    <Link href="/" onClick={() => setIsMenuOpen(false)}>
                                        <motion.div
                                            whileHover={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                        >
                                            <Image
                                                src="/logo-white.png"
                                                alt="Logo"
                                                height={200}
                                                width={200}
                                                className="h-8  w-auto"
                                            />
                                        </motion.div>
                                    </Link>
                                </div>

                                <div className="flex-1 max-w-2xl mx-8">
                                    <div className="relative">
                                        <form onSubmit={handleSearch}>
                                            <Search className="absolute left-5 top-3 h-5 w-5 text-white " />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search product or code"
                                                className="w-full pl-12 pr-4 py-2.5 bg-white/20 text-white 
                                                    rounded-full placeholder-gray-400 focus:outline-none 
                                                    focus:ring-2 focus:ring-blue-600 transition-all duration-300"
                                            />
                                        </form>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsContactOpen(true)}
                                    className="bg-blue-700 w-64 px-4 py-3 rounded-lg hover:bg-blue-700  text-sm font-semibold
                                        transition-colors text-white"
                                >
                                    Contact us
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom navbar with animation */}
                    <AnimatePresence>
                        {isNavVisible && !isMenuOpen && (
                            <motion.div
                                variants={bottomNavVariants}
                                initial="hidden"
                                animate={bottomNavPosition}
                                exit="hidden"
                                className={`border-t ${isMenuOpen || isScrolled ? 'bg-black' : 'bg-transparent'} 
                                    transition-colors duration-300 border-gray-800 fixed w-full z-40`}
                            >
                                <div className="w-full md:px-6 mx-auto">
                                    <div className="flex items-center justify-between pt-2 pb-3">
                                        <div className="flex space-x-16">
                                            {menuItems.map((item, index) => (
                                                <motion.div
                                                    key={item.name}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="text-white text-sm font-semibold relative group"
                                                    >
                                                        {item.name}
                                                        <motion.div
                                                            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"
                                                            layoutId={`underline-${item.name}`}
                                                        />
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Mobile Navigation */}
                <div className={`lg:hidden flex items-center justify-between p-4 text-white ${isMenuOpen || isScrolled ? 'bg-black' : 'bg-transparent'} transition-colors duration-300`}>
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2"
                        >
                            {isSearchOpen ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
                        </motion.button>
                        <Link href="/" onClick={() => setIsMenuOpen(false)}>
                            <Image
                                src="/logo-white.png"
                                alt="Logo"
                                height={200}
                                width={200}
                                className="h-6 w-auto"
                            />
                        </Link>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </motion.button>
                </div>
            </motion.nav>

            {/* Product Menu - Desktop Only */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-16 left-0 right-0 bottom-0 z-30 hidden lg:block"
                    >
                        <ProductMenu
                            isOpen={isMenuOpen}
                            onClose={() => setIsMenuOpen(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={mobileMenuVariants}
                        className="fixed inset-0 z-50 lg:hidden bg-black"
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between p-4">
                                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                                    <Image
                                        src="/logo-white.png"
                                        alt="Logo"
                                        height={200}
                                        width={200}
                                        className="h-6 w-auto"
                                    />
                                </Link>
                                <motion.button
                                    onClick={() => setIsMenuOpen(false)}
                                    whileHover={{ rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                    className="p-2 rounded-lg hover:bg-gray-800"
                                >
                                    <X className="h-6 w-6 text-white" />
                                </motion.button>
                            </div>

                            <div className="flex-1 overflow-y-auto  px-4 py-6 space-y-6">
                                {menuItems.map((item, index) => (
                                    <Link
                                        href={item.href}
                                        key={item.name}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <motion.span
                                            className="block text-xl text-white"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ x: 10 }}
                                        >
                                            {item.name}
                                        </motion.span>
                                    </Link>
                                ))}
                            </div>

                            <div className="p-4 space-y-4 border-t border-gray-800">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setIsContactOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-white"
                                >
                                    Contact us
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Search */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`lg:hidden fixed top-16 left-0 right-0 z-50 ${isScrolled ? 'bg-black' : ''}`}
                    >
                        <div className="p-4">
                            <div className="relative">
                                <form onSubmit={handleSearch}>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search product or code"
                                            className="w-full px-4 py-2 bg-gray-800 text-white 
                                            rounded-full placeholder-gray-400 focus:outline-none 
                                            focus:ring-2 focus:ring-blue-600"
                                            autoFocus
                                        />
                                        <button type="submit" className="absolute right-3 top-2.5">
                                            <Search className="h-5 w-5 text-gray-400" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Contact Modal */}
            <AnimatePresence>
                {isContactOpen && (
                    <ContactModal
                        isOpen={isContactOpen}
                        onClose={() => setIsContactOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;