import Image from 'next/image';
import React from 'react'

export const AccessoriesSection = ({ accessories = [] }) => {
    if (!accessories.length) return null;

    return (
        <div className="mt-12">
            
            <h2 className="text-xl font-medium mb-8">Accessories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {accessories.map((accessory) => (
                    <div key={accessory.id} className="space-y-4">
                        <h2 className="text-md ">{accessory.name}</h2>
                        <div className="space-y-2">
                            {accessory.selected_values.map((value) => (
                                <div 
                                    key={value._id}
                                    className="p-4 rounded-lg border border-white/20 bg-white/5"
                                >
                                    <div className="flex items-center gap-4">
                                        {value.image_url && (
                                           
                                                <Image
                                                    src={value.image_url}
                                                    alt={value.value}
                                                    height={200}
                                                    width={200}
                                                    className="object-cover h-16 w-32 rounded"
                                                />
                                            
                                        )}
                                        <div>
                                            <p className="font-medium">{value.value}</p>
                                            {value.value_shortform && (
                                                <p className="text-sm text-gray-400">
                                                    {value.value_shortform}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

