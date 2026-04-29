"use client";

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import SearchFiltersModal from '../SearchFiltersModal/SearchFiltersModal';
import { useTranslation } from '../../contexts/LanguageContext';

const TYPE_CHIPS = ['All', 'House', 'Apartment', 'Villa', 'Penthouse'] as const;

export default function Hero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLocation = searchParams.get('location') ?? '';
  const currentType = searchParams.get('type') ?? 'All';

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { dictionary } = useTranslation();

  const isFilterActive = Boolean(currentLocation) || (currentType && currentType.toLowerCase() !== 'all');

  const handleTypeChip = useCallback((type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type.toLowerCase() === 'all') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    // Reset pagination on type change
    params.delete('page');
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

  const handleApplyFilters = useCallback((location: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (location.trim()) {
      params.set('location', location.trim());
    } else {
      params.delete('location');
    }
    params.delete('page');
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

  const clearAllFilters = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark leading-tight">
          {dictionary.hero.title_start}
          <span className="relative inline-block">
            <span className="relative z-10 font-medium">{dictionary.hero.title_highlight}</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
          </span>
          {dictionary.hero.title_end}
        </h1>

        {/* Search bar */}
        <div className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">
              search
            </span>
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white text-nordic-dark shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-lg"
            placeholder={dictionary.hero.search_placeholder}
          />
          <button className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20">
            {dictionary.hero.search_button}
          </button>
        </div>

        {/* Type chips + Filters button */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
          {TYPE_CHIPS.map((chip) => {
            const isActive = chip.toLowerCase() === (currentType?.toLowerCase() || 'all');
            const chipTranslation = dictionary.hero.chips[chip.toLowerCase()] || chip;
            return (
              <button
                key={chip}
                onClick={() => handleTypeChip(chip)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10 scale-[1.03]'
                    : 'bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 hover:bg-mosque/5'
                }`}
              >
                {chipTranslation}
              </button>
            );
          })}

          <div className="w-px h-6 bg-nordic-dark/10 mx-2 flex-shrink-0"></div>

          <button
            onClick={() => setIsFiltersOpen(true)}
            className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
              currentLocation
                ? 'bg-mosque text-white shadow-lg shadow-mosque/20'
                : 'text-nordic-dark hover:bg-black/5'
            }`}
          >
            <span className="material-icons text-base">tune</span>
            {dictionary.hero.filters}
            {currentLocation && (
              <span className="ml-1 bg-white/20 text-white text-xs rounded-full px-2 py-0.5 font-semibold">
                1
              </span>
            )}
          </button>
        </div>

        {/* Active filter pills */}
        {isFilterActive && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {currentType && currentType.toLowerCase() !== 'all' && (
              <div className="flex items-center gap-2 bg-nordic-dark/10 text-nordic-dark rounded-full px-4 py-1.5 text-sm font-medium">
                <span className="material-icons text-sm">home</span>
                {dictionary.hero.chips[currentType.toLowerCase()] || currentType}
                <button
                  onClick={() => handleTypeChip('All')}
                  className="ml-1 hover:opacity-70 transition-opacity"
                  aria-label="Remove type filter"
                >
                  <span className="material-icons text-sm">close</span>
                </button>
              </div>
            )}
            {currentLocation && (
              <div className="flex items-center gap-2 bg-mosque/10 text-mosque rounded-full px-4 py-1.5 text-sm font-medium">
                <span className="material-icons text-sm">location_on</span>
                {currentLocation}
                <button
                  onClick={() => handleApplyFilters('')}
                  className="ml-1 hover:text-mosque/70 transition-colors"
                  aria-label="Remove location filter"
                >
                  <span className="material-icons text-sm">close</span>
                </button>
              </div>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-nordic-muted hover:text-nordic-dark transition-colors underline underline-offset-2"
            >
              {dictionary.hero.clear_all}
            </button>
          </div>
        )}
      </div>

      <SearchFiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApply={handleApplyFilters}
        currentLocation={currentLocation}
      />
    </section>
  );
}
