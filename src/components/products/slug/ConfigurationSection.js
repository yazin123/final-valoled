'use client'
import React, { useState, useEffect } from 'react';

export const ConfigurationSection = ({ productCode, onConfigChange }) => {
    const [quantity, setQuantity] = useState(1);
    const [project, setProject] = useState('');

    useEffect(() => {
        onConfigChange?.({ project, quantity });
    }, [project, quantity, onConfigChange]);

    return (
        <div className="mt-12">
            <h2 className="text-xl font-medium mb-8">Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                    <label className="block text-sm text-gray-400">
                        Project
                    </label>
                    <input
                        type="text"
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                        placeholder="Enter project name"
                        className="w-full px-4 py-2 rounded-lg border
                            bg-transparent border-white/20 focus:border-white/40 outline-none transition-colors"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm text-gray-400">
                        Part
                    </label>
                    <input
                        type="text"
                        value={productCode}
                        readOnly
                        className="w-full px-4 py-2 rounded-lg border
                           bg-white/5 border-white/20 cursor-not-allowed"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm text-gray-400">
                        Quantity
                    </label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        min={1}
                        className="w-full px-4 py-2 rounded-lg border
                           bg-transparent border-white/20 focus:border-white/40 outline-none transition-colors"
                    />
                </div>
            </div>
        </div>
    );
};