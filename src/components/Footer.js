
'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { ContactModal } from './ContactModal';

const Footer = () => {
    const [isContactOpen, setIsContactOpen] = useState(false);

    const socialLinks = [
        { icon: <Instagram size={20} />, label: 'Instagram', href: '#' },
        { icon: <Facebook size={20} />, label: 'Facebook', href: '#' },
        { icon: <Twitter size={20} />, label: 'Twitter', href: '#' },
        { icon: <Linkedin size={20} />, label: 'Linkedin', href: '#' },
        { icon: <Youtube size={20} />, label: 'Youtube', href: '#' },
    ];

    const footerLinks = {
        column2: {
            title: 'Resources',
            links: [
                { label: 'Catalogues', href: '/catalogues' },
                { label: 'Projects', href: '/projects' },
                { label: 'Products', href: '/products' },
            ]
        },
        column3: {
            title: 'Light & Media Group',
            links: [
                { 
                    label: 'Contact', 
                    href: '#',
                    onClick: () => setIsContactOpen(true)
                },
                { label: 'News', href: '/news' },
            ]
        },
        column4: {
            title: 'Helpful',
            links: [
                { label: 'Research & development', href: '/research-development' },
                { label: 'About Us', href: '/about' },
            ]
        },
    };

    return (
        <footer className="bg-black text-white">
            <div className="w-full md:pl-40 mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <div className="space-y-4">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    className="flex items-center gap-2 hover:text-gray-300 transition-colors"
                                >
                                    {social.icon}
                                    <span>{social.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {Object.values(footerLinks).map((column, index) => (
                        <div key={column.title} className="lg:col-span-1">
                            <h3 className="font-medium mb-4">{column.title}</h3>
                            <ul className="space-y-2">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        {link.onClick ? (
                                            <button
                                                onClick={link.onClick}
                                                className="text-gray-300 hover:text-white transition-colors"
                                            >
                                                {link.label}
                                            </button>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                className="text-gray-300 hover:text-white transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="py-16 border-t border-gray-800">
                <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-400">
                    <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                        Terms and Conditions
                    </Link>
                    <Link href="/privacy-policy" className="hover:text-white transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/cookie-policy" className="hover:text-white transition-colors">
                        Cookie Policy
                    </Link>
                </div>
            </div>

            <AnimatePresence>
                {isContactOpen && (
                    <ContactModal
                        isOpen={isContactOpen}
                        onClose={() => setIsContactOpen(false)}
                    />
                )}
            </AnimatePresence>
        </footer>
    );
};

export default Footer;