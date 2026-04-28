import Link from 'next/link';
import { Property } from '../../../lib/properties';
import PropertyCard from '../PropertyCard/PropertyCard';

interface NewInMarketProps {
  properties: Property[];
  currentPage: number;
  totalPages: number;
}

export default function NewInMarket({ properties, currentPage, totalPages }: NewInMarketProps) {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // Generate page numbers to show (max 5 centered around current)
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <section>
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark dark:text-white">
            New in Market
          </h2>
          <p className="text-nordic-muted mt-1 text-sm">
            Fresh opportunities added this week.
          </p>
        </div>
        <div className="hidden md:flex bg-white dark:bg-white/5 p-1 rounded-lg">
          <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm">
            All
          </button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark dark:hover:text-white">
            Buy
          </button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark dark:hover:text-white">
            Rent
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            variant="standard"
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          {/* Prev button */}
          <Link
            href={hasPrev ? `/?page=${currentPage - 1}` : '#'}
            aria-disabled={!hasPrev}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200
              ${hasPrev
                ? 'border-nordic-dark/10 dark:border-white/10 text-nordic-dark dark:text-white bg-white dark:bg-white/5 hover:border-mosque hover:text-mosque'
                : 'border-nordic-dark/5 dark:border-white/5 text-nordic-dark/30 dark:text-white/20 bg-white/50 dark:bg-white/2 cursor-not-allowed pointer-events-none'
              }
            `}
          >
            <span className="material-icons text-base leading-none">arrow_back</span>
            Prev
          </Link>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNum) => (
              <Link
                key={pageNum}
                href={`/?page=${pageNum}`}
                className={`
                  w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                  ${pageNum === currentPage
                    ? 'bg-nordic-dark dark:bg-white text-white dark:text-nordic-dark shadow-sm'
                    : 'bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 text-nordic-dark dark:text-white hover:border-mosque hover:text-mosque'
                  }
                `}
              >
                {pageNum}
              </Link>
            ))}
          </div>

          {/* Next button */}
          <Link
            href={hasNext ? `/?page=${currentPage + 1}` : '#'}
            aria-disabled={!hasNext}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200
              ${hasNext
                ? 'border-nordic-dark/10 dark:border-white/10 text-nordic-dark dark:text-white bg-white dark:bg-white/5 hover:border-mosque hover:text-mosque'
                : 'border-nordic-dark/5 dark:border-white/5 text-nordic-dark/30 dark:text-white/20 bg-white/50 dark:bg-white/2 cursor-not-allowed pointer-events-none'
              }
            `}
          >
            Next
            <span className="material-icons text-base leading-none">arrow_forward</span>
          </Link>
        </div>
      )}

      {/* Summary */}
      {totalPages > 0 && (
        <p className="text-center mt-4 text-xs text-nordic-muted">
          Page {currentPage} of {totalPages}
        </p>
      )}
    </section>
  );
}
