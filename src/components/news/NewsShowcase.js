'use client'
import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { newService } from '@/utils/newsApi';

const DatePickerDropdown = ({ label, options, selectedValues, onChange, onClear = () => { } }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleCheckboxChange = (option, e) => {
        e.preventDefault(); 
        const newSelection = selectedValues.includes(option)
            ? selectedValues.filter(item => item !== option)
            : [...selectedValues, option];
        onChange(newSelection);
    };

    const selectedCount = selectedValues.length;
    const displayLabel = selectedCount > 0 ? `${label} (${selectedCount})` : label;

    const handleClear = (e) => {
        e.stopPropagation();
        onClear();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full px-4 py-2 gap-8 border rounded
                    transition-all duration-200 ease-in-out
                   border-gray-600 text-white bg-black hover:bg-[#403F3F]`}
            >
                <span>{displayLabel}</span>
                <ChevronDown 
                    className={`w-4 h-4 transform transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                    }`} 
                />
            </button>

            <div 
                className={`absolute z-10 w-full mt-1 border rounded shadow-lg transform transition-all duration-200 ease-in-out origin-top
                   bg-black border-gray-700 text-white
                    ${isOpen 
                        ? 'opacity-100 scale-y-100' 
                        : 'opacity-0 scale-y-0 pointer-events-none'}`}
            >
                {options.map((option) => (
                    <div
                        key={option}
                        className={`flex items-center px-4 py-2 cursor-pointer transition-colors duration-200
                          hover:bg-gray-800`}
                        onClick={(e) => handleCheckboxChange(option, e)}
                    >
                        <input
                            type="checkbox"
                            checked={selectedValues.includes(option)}
                            className="mr-3 h-4 w-4 rounded border-gray-300"
                        />
                        <span>{option}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const NewsShowcase = () => {
  
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await newService.getAllnews();
                setNewsItems(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) return (
        <div className="text-center py-10">
            <p>Loading news...</p>
        </div>
    );

    if (error) return (
        <div className="text-center py-10 text-red-500">
            <p>Error loading news: {error.message}</p>
        </div>
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6  border-b border-gray-700 pb-4">
                <h1 className="text-4xl">News</h1>
                <DatePickerDropdown 
                    label="Date" 
                    options={['2024', '2023', '2022']} 
                    selectedValues={[]} 
                    onChange={() => { }} 
                    onClear={() => { }} 
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {newsItems.map((newsItem) => (
                    <Link href={`/news/${newsItem._id}`} key={newsItem._id} className="group relative">
                        <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-800">
                            <img
                                src={newsItem.image_url}
                                alt={newsItem.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <div className="mt-4">
                            <div className={`text-lg font-medium text-white`}>
                                {newsItem.title}
                            </div>
                            <div 
                                className={`text-sm text-gray-400`}
                                dangerouslySetInnerHTML={{
                                    __html: newsItem.content.length > 100 
                                        ? newsItem.content.substring(0, 100) + '...' 
                                        : newsItem.content
                                }}
                            />
                            <div className={`text-sm font-bold text-gray-400`}>
                                {new Date(newsItem.postedDate).toLocaleDateString()}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default NewsShowcase