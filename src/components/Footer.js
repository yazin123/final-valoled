'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { ContactModal } from './ContactModal';
import { useCompanySettings } from '@/hooks/api-hooks';

const Footer = () => {
    const [isContactOpen, setIsContactOpen] = useState(false);
    const { data: companySettings, isLoading } = useCompanySettings();

    // Map social media icons to their respective Lucide components
    const getSocialIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'instagram':
                return <Instagram size={20} />;
            case 'facebook':
                return <Facebook size={20} />;
            case 'twitter':
                return <Twitter size={20} />;
            case 'linkedin':
                return <Linkedin size={20} />;
            case 'youtube':
                return <Youtube size={20} />;
            default:
                return null;
        }
    };

    // Generate social links from API data - Direct access, no nested .data
    const socialLinks = !isLoading && companySettings?.socialMedia
        ? Object.entries(companySettings.socialMedia)
            .filter(([_, value]) => value && value.trim() !== '') // Filter out empty values
            .map(([key, value]) => ({
                icon: getSocialIcon(key),
                label: key.charAt(0).toUpperCase() + key.slice(1),
                href: value,
            }))
            .filter(link => link.icon !== null)
        : [];
    
    // Get contact email from API - Direct access, no nested .data
    const contactEmail = !isLoading && companySettings?.contactEmail 
        ? companySettings.contactEmail 
        : 'contact@company.com';

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

    // Determine if we should show the social media column
    const showSocialMedia = socialLinks.length > 0;

    return (
        <footer className="bg-black text-white">
            <div className="w-full md:pl-40 mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Only render the social media column if we have links */}
                    {showSocialMedia && (
                        <div className="lg:col-span-1">
                            <div className="space-y-4">
                                {socialLinks.map((social) => (
                                    <Link
                                        key={social.label}
                                        href={social.href}
                                        className="flex items-center gap-2 hover:text-gray-300 transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {social.icon}
                                        <span>{social.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Adjust grid columns based on whether social media exists */}
                    {Object.values(footerLinks).map((column, index) => (
                        <div key={column.title} className={`lg:col-span-1 ${!showSocialMedia && index === 0 ? 'lg:col-start-2' : ''}`}>
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
                <div className="flex flex-wrap gap-4 justify-center md:text-sm text-xs text-gray-400">
                    <Link href="/terms-and-conditions" className="hover:text-white transition-colors ">
                        Terms & Conditions
                    </Link>
                    <Link href="/privacy-policy" className="hover:text-white transition-colors ">
                        Privacy Policy
                    </Link>
                    <Link href="/cookie-policy" className="hover:text-white transition-colors ">
                        Cookie Policy
                    </Link>
                </div>
            </div>

            <AnimatePresence>
                {isContactOpen && (
                    <ContactModal
                        isOpen={isContactOpen}
                        onClose={() => setIsContactOpen(false)}
                        contactEmail={contactEmail}
                    />
                )}
            </AnimatePresence>
        </footer>
    );
};

export default Footer;