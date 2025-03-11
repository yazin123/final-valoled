// src/components/ContactModal.js
'use client'
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import emailService from '@/lib/emailService';

export const ContactModal = ({ isOpen, onClose, contactEmail = 'contact@company.com' }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
    });
    const [submitStatus, setSubmitStatus] = useState(null); // 'loading', 'success', 'error', or null
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setSubmitStatus('loading');
            
            // Use the email service to send the email
            const result = await emailService.sendContactEmail(formData, contactEmail);
            
            if (result.success) {
                setSubmitStatus('success');
                // Reset form after a delay
                setTimeout(() => {
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        message: ''
                    });
                    setSubmitStatus(null);
                    onClose();
                }, 2000);
            } else {
                setSubmitStatus('error');
                setErrorMessage(result.error);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
            setErrorMessage('An unexpected error occurred. Please try again later.');
        }
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
            className="fixed inset-0 z-50 overflow-y-auto" style={{zIndex:"1001"}}
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
                        
                        {submitStatus === 'success' && (
                            <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded">
                                Your message has been sent successfully! We'll get back to you soon.
                            </div>
                        )}
                        
                        {submitStatus === 'error' && (
                            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded">
                                {errorMessage || `There was an error sending your message. Please try again or contact us directly at ${contactEmail}.`}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm mb-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded border bg-transparent border-white/20 focus:border-white/50 transition-colors"
                                disabled={submitStatus === 'loading'}
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
                                disabled={submitStatus === 'loading'}
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
                                disabled={submitStatus === 'loading'}
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
                                disabled={submitStatus === 'loading'}
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
                                disabled={submitStatus === 'loading'}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
                            disabled={submitStatus === 'loading' || submitStatus === 'success'}
                        >
                            {submitStatus === 'loading' ? 'Sending...' : 
                             submitStatus === 'success' ? 'Message Sent' : 'Send Message'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
};