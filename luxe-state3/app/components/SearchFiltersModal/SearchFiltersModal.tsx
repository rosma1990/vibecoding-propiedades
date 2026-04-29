"use client";

import React, { useEffect, useState } from 'react';

interface SearchFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (location: string) => void;
  currentLocation?: string;
}

export default function SearchFiltersModal({ isOpen, onClose, onApply, currentLocation = '' }: SearchFiltersModalProps) {
  const [location, setLocation] = useState(currentLocation);

  // Sync if parent changes currentLocation (e.g. URL cleared externally)
  useEffect(() => {
    setLocation(currentLocation);
  }, [currentLocation, isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleApply = () => {
    onApply(location);
    onClose();
  };

  const handleClear = () => {
    setLocation('');
    onApply('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-nordic-dark/40 backdrop-blur-sm z-10 transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Container */}
      <main className="relative z-20 w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <header className="px-8 py-6 border-b border-nordic-dark/10 flex justify-between items-center bg-white sticky top-0 z-30">
          <h1 className="text-2xl font-semibold tracking-tight text-nordic-dark">Filters</h1>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 transition-colors text-nordic-muted"
          >
            <span className="material-icons">close</span>
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">

          {/* Section 1: Location */}
          <section>
            <label htmlFor="filter-location" className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider mb-3">
              Location
            </label>
            <div className="relative group">
              <span className="material-icons absolute left-4 top-3.5 text-nordic-muted group-focus-within:text-mosque transition-colors">
                location_on
              </span>
              <input
                id="filter-location"
                className="w-full pl-12 pr-4 py-3 bg-black/5 border-0 rounded-lg text-nordic-dark placeholder-nordic-muted focus:ring-2 focus:ring-mosque focus:bg-white transition-all shadow-sm outline-none"
                placeholder="City, neighborhood, or address"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleApply(); }}
              />
              {location && (
                <button
                  onClick={() => setLocation('')}
                  className="absolute right-4 top-3.5 text-nordic-muted hover:text-nordic-dark transition-colors"
                >
                  <span className="material-icons text-lg">close</span>
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-nordic-muted/70">
              Type a city or state to filter properties in "New in Market"
            </p>
          </section>

          {/* Section 2: Price Range */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider">
                Price Range
              </label>
              <span className="text-sm font-medium text-mosque">$1.2M – $4.5M</span>
            </div>

            <div className="relative h-12 flex items-center mb-6 px-2">
              <div className="absolute w-full h-1 bg-black/10 rounded-full overflow-hidden">
                <div className="h-full bg-mosque w-1/3 ml-[20%]"></div>
              </div>
              <div className="absolute left-[20%] w-6 h-6 bg-white border-2 border-mosque rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform -ml-3 z-10"></div>
              <div className="absolute left-[53%] w-6 h-6 bg-white border-2 border-mosque rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform -ml-3 z-10"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/5 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-nordic-muted uppercase font-medium mb-1">Min Price</label>
                <div className="flex items-center">
                  <span className="text-nordic-muted mr-1">$</span>
                  <input className="w-full bg-transparent border-0 p-0 text-nordic-dark font-medium focus:ring-0 text-sm outline-none" type="text" defaultValue="1,200,000" />
                </div>
              </div>
              <div className="bg-black/5 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-nordic-muted uppercase font-medium mb-1">Max Price</label>
                <div className="flex items-center">
                  <span className="text-nordic-muted mr-1">$</span>
                  <input className="w-full bg-transparent border-0 p-0 text-nordic-dark font-medium focus:ring-0 text-sm outline-none" type="text" defaultValue="4,500,000" />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Property Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider">
                Property Type
              </label>
              <div className="relative">
                <select className="w-full bg-black/5 border-0 rounded-lg py-3 pl-4 pr-10 text-nordic-dark appearance-none focus:ring-2 focus:ring-mosque cursor-pointer outline-none">
                  <option>Any Type</option>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                </select>
                <span className="material-icons absolute right-3 top-3 text-nordic-muted pointer-events-none">expand_more</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-nordic-dark">Bedrooms</span>
                <div className="flex items-center space-x-3 bg-black/5 rounded-full p-1">
                  <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-nordic-muted hover:text-mosque transition-colors">
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold text-nordic-dark w-4 text-center">3+</span>
                  <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors">
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-nordic-dark">Bathrooms</span>
                <div className="flex items-center space-x-3 bg-black/5 rounded-full p-1">
                  <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-nordic-muted hover:text-mosque transition-colors">
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold text-nordic-dark w-4 text-center">2+</span>
                  <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors">
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Amenities */}
          <section>
            <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider mb-4">
              Amenities &amp; Features
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label className="cursor-pointer group relative">
                <input defaultChecked className="peer sr-only" type="checkbox" />
                <div className="h-full px-4 py-3 rounded-lg border border-mosque bg-mosque/5 text-mosque font-medium text-sm flex items-center justify-center gap-2 transition-all peer-checked:bg-mosque/10 peer-checked:border-mosque peer-checked:text-mosque hover:bg-mosque/10">
                  <span className="material-icons text-lg">pool</span>
                  Swimming Pool
                </div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full opacity-100 transition-opacity"></div>
              </label>

              <label className="cursor-pointer group">
                <input className="peer sr-only" type="checkbox" />
                <div className="h-full px-4 py-3 rounded-lg border border-nordic-dark/10 bg-white text-nordic-muted text-sm flex items-center justify-center gap-2 transition-all hover:border-nordic-dark/20 peer-checked:border-mosque peer-checked:bg-mosque/5 peer-checked:text-mosque">
                  <span className="material-icons text-lg text-nordic-muted/60 group-hover:text-nordic-muted peer-checked:text-mosque">fitness_center</span>
                  Gym
                </div>
              </label>

              <label className="cursor-pointer group">
                <input className="peer sr-only" type="checkbox" />
                <div className="h-full px-4 py-3 rounded-lg border border-nordic-dark/10 bg-white text-nordic-muted text-sm flex items-center justify-center gap-2 transition-all hover:border-nordic-dark/20 peer-checked:border-mosque peer-checked:bg-mosque/5 peer-checked:text-mosque">
                  <span className="material-icons text-lg text-nordic-muted/60 group-hover:text-nordic-muted peer-checked:text-mosque">local_parking</span>
                  Parking
                </div>
              </label>

              <label className="cursor-pointer group">
                <input className="peer sr-only" type="checkbox" />
                <div className="h-full px-4 py-3 rounded-lg border border-nordic-dark/10 bg-white text-nordic-muted text-sm flex items-center justify-center gap-2 transition-all hover:border-nordic-dark/20 peer-checked:border-mosque peer-checked:bg-mosque/5 peer-checked:text-mosque">
                  <span className="material-icons text-lg text-nordic-muted/60 group-hover:text-nordic-muted peer-checked:text-mosque">ac_unit</span>
                  Air Conditioning
                </div>
              </label>

              <label className="cursor-pointer group relative">
                <input defaultChecked className="peer sr-only" type="checkbox" />
                <div className="h-full px-4 py-3 rounded-lg border border-mosque bg-mosque/5 text-mosque font-medium text-sm flex items-center justify-center gap-2 transition-all peer-checked:bg-mosque/10 peer-checked:border-mosque peer-checked:text-mosque hover:bg-mosque/10">
                  <span className="material-icons text-lg">wifi</span>
                  High-speed Wifi
                </div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full opacity-100 transition-opacity"></div>
              </label>

              <label className="cursor-pointer group">
                <input className="peer sr-only" type="checkbox" />
                <div className="h-full px-4 py-3 rounded-lg border border-nordic-dark/10 bg-white text-nordic-muted text-sm flex items-center justify-center gap-2 transition-all hover:border-nordic-dark/20 peer-checked:border-mosque peer-checked:bg-mosque/5 peer-checked:text-mosque">
                  <span className="material-icons text-lg text-nordic-muted/60 group-hover:text-nordic-muted peer-checked:text-mosque">deck</span>
                  Patio / Terrace
                </div>
              </label>
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-nordic-dark/10 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-sm font-medium text-nordic-muted hover:text-nordic-dark transition-colors underline decoration-nordic-muted/30 underline-offset-4"
          >
            Clear all filters
          </button>
          <button
            onClick={handleApply}
            className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-mosque/30 transition-all hover:shadow-mosque/40 flex items-center gap-2 transform active:scale-95"
          >
            Show Results
            <span className="material-icons text-sm">arrow_forward</span>
          </button>
        </footer>

      </main>
    </div>
  );
}
