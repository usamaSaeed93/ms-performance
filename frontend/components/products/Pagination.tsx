"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-[6px] sm:rounded-[8px] border border-gray-300 bg-white px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-[#0c1b33] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors whitespace-nowrap"
      >
        <span className="hidden sm:inline">← Previous</span>
        <span className="sm:hidden">←</span>
      </button>
      
      {pageNumbers.map((page, idx) => {
        if (page === 'ellipsis') {
          return (
            <span key={`ellipsis-${idx}`} className="px-1.5 sm:px-2 text-xs sm:text-sm text-[#5c6c86] hidden sm:inline">
              ...
            </span>
          );
        }
        
        const pageNum = page as number;
        // Hide some page numbers on very small screens
        const isVisibleOnMobile = totalPages <= 5 || 
          pageNum === 1 || 
          pageNum === totalPages || 
          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
        
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`rounded-[6px] sm:rounded-[8px] px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition-colors ${
              currentPage === pageNum
                ? "bg-[#1d70ff] text-white"
                : "bg-white border border-gray-300 text-[#0c1b33] hover:bg-gray-50"
            } ${isVisibleOnMobile ? "inline-flex" : "hidden sm:inline-flex"}`}
          >
            {pageNum}
          </button>
        );
      })}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-[6px] sm:rounded-[8px] border border-gray-300 bg-white px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-[#0c1b33] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors whitespace-nowrap"
      >
        <span className="hidden sm:inline">Next →</span>
        <span className="sm:hidden">→</span>
      </button>
    </div>
  );
}

