'use client'
import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Loader2, Check } from 'lucide-react';
import { generatePDF } from './PDFGenerator';

// Main Modal Component for Spec Sheet
const SpecSheetModal = ({ isOpen, onClose, product, selectedSpecs, fullProductCode }) => {
  const [status, setStatus] = useState('idle'); // 'idle', 'generating', 'completed', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const isMounted = useRef(true);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Close the modal if not open
  if (!isOpen) return null;

  // Helper function to safely get values
  const safeProduct = product || {};
  const safeSpecs = selectedSpecs || {};

  // Handle PDF generation
  const handleGeneratePDF = async () => {
    try {
      setStatus('generating');
      
      await generatePDF(safeProduct, safeSpecs, fullProductCode);
      
      if (isMounted.current) {
        setStatus('completed');

        // Close the modal after a delay
        setTimeout(() => {
          if (isMounted.current) {
            onClose();
          }
        }, 1500);
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      if (isMounted.current) {
        setErrorMessage('Failed to generate PDF. Please try again.');
        setStatus('error');

        // Clear error message after a delay
        setTimeout(() => {
          if (isMounted.current) {
            setErrorMessage('');
            setStatus('idle');
          }
        }, 3000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="min-h-screen px-4 text-center">
        <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

        <div className="inline-block w-full max-w-4xl p-6 my-8 text-left align-middle transition-all transform bg-gray-900 shadow-xl rounded-2xl border border-gray-800">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-normal text-white mb-1">{safeProduct.name || 'Product'}</h2>
              <p className="text-gray-400">Product Code: {fullProductCode || safeProduct.code || 'N/A'}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              disabled={status === 'generating'}
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="mt-4 mb-6 space-y-2">
            <h3 className="text-lg font-medium text-white">Selected Specifications:</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(safeSpecs)
                .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
                .map(([specName, value]) => (
                  <div key={specName} className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-gray-400">{specName}:</span>
                    <span className="ml-2 text-white">{value}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="relative">
            {status === 'completed' ? (
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg transition-colors"
                disabled
              >
                <Check className="w-5 h-5" />
                Specification Sheet Downloaded Successfully!
              </button>
            ) : status === 'error' ? (
              <button
                onClick={handleGeneratePDF}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            ) : (
              <button
                onClick={handleGeneratePDF}
                disabled={status === 'generating'}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'generating' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Specification Sheet...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Specification Sheet
                  </>
                )}
              </button>
            )}
          </div>

          {/* Manual reset option for stuck processes */}
          {status === 'generating' && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setStatus('idle');
                  setErrorMessage('PDF generation cancelled.');
                  setTimeout(() => setErrorMessage(''), 3000);
                }}
                className="text-sm text-gray-400 hover:text-white"
              >
                Cancel Generation
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
              {errorMessage}
            </div>
          )}

          {status === 'completed' && (
            <div className="absolute bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
              Specification sheet downloaded successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecSheetModal;