import Image from "next/image";
import Link from "next/link";

const ProductGrid = ({ products = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="animate-pulse bg-zinc-800 rounded-lg aspect-square" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid mt-4 grid-cols-1 md:grid-cols-5 gap-6">
      {products.map((product) => (
        <Link
          href={`/family/products/${product._id}`}
          key={product._id}
          className="group bg-zinc-800 rounded-lg overflow-hidden"
        >
          <div className="aspect-square relative bg-zinc-700">
            <Image
              src={product.imageUrl || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.latest && (
              <span className="absolute top-4 right-4 bg-blue-600 text-xs px-3 py-1 rounded-full text-white">
                NEW
              </span>
            )}
          </div>
          <div className="p-4 text-center">
            <h3 className="text-lg font-medium mb-1 text-white">{product.name}</h3>
            <p className="text-sm uppercase text-gray-400">{product.code}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};


export default ProductGrid;