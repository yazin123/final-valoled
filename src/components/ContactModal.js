// ContactModal.js
'use client'
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export const ContactModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto "
        >
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-lg rounded-xl p-6 shadow-xl bg-black text-white"
                >
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>

                        <div>
                            <label className="block text-sm mb-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded border bg-transparent border-white/20 focus:border-white/50 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded border bg-transparent border-white/20 focus:border-white/50 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded border bg-transparent border-white/20 focus:border-white/50 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2">Company</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded border bg-transparent border-white/20 focus:border-white/50 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2">Message</label>
                            <textarea
                                name="message"
                                required
                                rows="4"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded border bg-transparent border-white/20 focus:border-white/50 transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                            Send Message
                        </button>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
};
