'use client'
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ProductsPage from './ProductsPage';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  
  return <ProductsPage searchParams={searchParams} />;
}

export default function ProductsPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center text-white">Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}