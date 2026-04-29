'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Property, toggleFeatured } from '../../../lib/properties';
import { useTranslation } from '../../contexts/LanguageContext';

interface PropertyCardProps {
  property: Property;
  variant?: 'featured' | 'standard';
  className?: string;
}

export default function PropertyCard({ property, variant = 'standard', className = '' }: PropertyCardProps) {
  const router = useRouter();
  const [isFeatured, setIsFeatured] = useState(property.is_featured ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const { dictionary } = useTranslation();

  const handleFavorite = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    // Optimistic update: flip immediately in the UI
    setIsLoading(true);
    const previousValue = isFeatured;
    setIsFeatured(!isFeatured);

    const result = await toggleFeatured(property.id, previousValue);

    if (!result.success) {
      // Revert on failure
      setIsFeatured(previousValue);
    } else {
      // Refresh server data so Featured Collections & New in Market update
      router.refresh();
    }

    setIsLoading(false);
  }, [isLoading, isFeatured, property.id, router]);

  if (variant === 'featured') {
    return (
      <Link href={`/properties/${property.slug || property.id}`} className={`block group relative rounded-xl overflow-hidden shadow-soft bg-white cursor-pointer ${className}`}>
        <div className="aspect-[4/3] w-full overflow-hidden relative">
          <img
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={property.images[0]}
          />
          {property.badge && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-nordic-dark">
              {property.badge}
            </div>
          )}
          <button
            onClick={handleFavorite}
            disabled={isLoading}
            title={isFeatured ? 'Remove from Featured Collections' : 'Add to Featured Collections'}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-200 ${
              isLoading
                ? 'bg-white/90 opacity-60 cursor-not-allowed'
                : isFeatured
                  ? 'bg-mosque text-white shadow-lg shadow-mosque/30 scale-110'
                  : 'bg-white/90 text-nordic-dark hover:bg-mosque hover:text-white'
            }`}
          >
            <span className={`material-icons text-xl transition-all duration-200 ${isLoading ? 'animate-pulse' : ''}`}>
              {isFeatured ? 'favorite' : 'favorite_border'}
            </span>
          </button>
        </div>
        <div className="p-6 relative">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-medium text-nordic-dark group-hover:text-mosque transition-colors">
                {property.title}
              </h3>
              <p className="text-nordic-muted text-sm flex items-center gap-1 mt-1">
                <span className="material-icons text-sm">place</span> {property.location}
              </p>
            </div>
            <span className="text-xl font-semibold text-mosque">{property.price}</span>
          </div>
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-nordic-dark/5">
            <div className="flex items-center gap-2 text-nordic-muted text-sm">
              <span className="material-icons text-lg">king_bed</span> {property.beds} {dictionary.property_card.beds}
            </div>
            <div className="flex items-center gap-2 text-nordic-muted text-sm">
              <span className="material-icons text-lg">bathtub</span> {property.baths} {dictionary.property_card.baths}
            </div>
            <div className="flex items-center gap-2 text-nordic-muted text-sm">
              <span className="material-icons text-lg">square_foot</span> {property.area}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Standard Variant (New in Market)
  const isRent = property.type === 'rent';
  const badgeClass = isRent ? 'bg-mosque/90' : 'bg-nordic-dark/90';
  const badgeText = isRent ? dictionary.property_card.for_rent : dictionary.property_card.for_sale;

  return (
    <Link href={`/properties/${property.slug || property.id}`} className={`block bg-white rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col ${className}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={property.images[0]}
        />
        <button
          onClick={handleFavorite}
          disabled={isLoading}
          title={isFeatured ? 'Remove from Featured Collections' : 'Add to Featured Collections'}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isLoading
              ? 'bg-white/90 opacity-60 cursor-not-allowed'
              : isFeatured
                ? 'bg-mosque text-white shadow-md shadow-mosque/40 scale-110'
                : 'bg-white/90 text-nordic-dark hover:bg-mosque hover:text-white'
          }`}
        >
          <span className={`material-icons text-lg transition-all duration-200 ${isLoading ? 'animate-pulse' : ''}`}>
            {isFeatured ? 'favorite' : 'favorite_border'}
          </span>
        </button>
        <div className={`absolute bottom-3 left-3 ${badgeClass} text-white text-xs font-bold px-2 py-1 rounded`}>
          {badgeText}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-bold text-lg text-nordic-dark">
            {property.price}
            {isRent && <span className="text-sm font-normal text-nordic-muted">{dictionary.property_card.mo}</span>}
          </h3>
        </div>
        <h4 className="text-nordic-dark font-medium truncate mb-1">
          {property.title}
        </h4>
        <p className="text-nordic-muted text-xs mb-4">{property.location}</p>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">king_bed</span> {property.beds}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">bathtub</span> {property.baths}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">square_foot</span> {property.area}
          </div>
        </div>
      </div>
    </Link>
  );
}
