import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading
}) => {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 0) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8 " id="pagein">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className={`p-2 rounded-lg transition-colors duration-200 
         hover:bg-white/10
          ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
          ${isLoading ? 'cursor-not-allowed' : ''}`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex gap-2">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' ? onPageChange(page) : null}
            disabled={isLoading}
            className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg 
              transition-colors duration-200 
              ${typeof page === 'number' 
                ? page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-white/10' 
                    
                : ''
              }
              ${isLoading ? 'cursor-not-allowed' : ''}`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className={`p-2 rounded-lg transition-colors duration-200 
        hover:bg-white/10
          ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}
          ${isLoading ? 'cursor-not-allowed' : ''}`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;