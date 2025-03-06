'use client'
import React from 'react';
import SpecSheetModal from './SpecSheetModal';

/**
 * SpecSheet Component
 * Main entry point for the spec sheet functionality
 * This component serves as a wrapper for the modal and coordinates data flow
 */
export const SpecSheet = ({ 
  isOpen, 
  onClose, 
  product, 
  selectedSpecs, 
  selectedSpecCodes, 
  fullProductCode 
}) => {
  // Simply render the modal component with all necessary props
  return (
    <SpecSheetModal
      isOpen={isOpen}
      onClose={onClose}
      product={product}
      selectedSpecs={selectedSpecs}
      fullProductCode={fullProductCode}
    />
  );
};

export default SpecSheet;