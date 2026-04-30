"use client";

import { useState } from "react";

export function PropertiesList({ properties }: { properties: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalItems = properties?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = properties?.slice(startIndex, endIndex) || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-nordic-dark/60 uppercase tracking-wider">
        <div className="col-span-6">Property Details</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* List Items */}
      {currentProperties.length === 0 ? (
        <div className="px-6 py-12 text-center text-nordic-dark/50 border-b border-gray-100">
          <span className="material-icons text-4xl block mb-2 opacity-50">home_work</span>
          No properties found
        </div>
      ) : (
        currentProperties.map((property) => (
          <div key={property.id} className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 hover:bg-background-light transition-colors items-center">
            
            {/* Property Details */}
            <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
              <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={property.images[0]} 
                    alt={property.title} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                ) : (
                  <span className="material-icons absolute inset-0 flex items-center justify-center text-gray-400">image</span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-nordic-dark group-hover:text-mosque transition-colors cursor-pointer line-clamp-1">{property.title}</h3>
                <p className="text-sm text-nordic-dark/60 line-clamp-1">{property.location}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-nordic-dark/50">
                  <span className="flex items-center gap-1"><span className="material-icons text-[14px]">bed</span> {property.beds || 0} Beds</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="flex items-center gap-1"><span className="material-icons text-[14px]">bathtub</span> {property.baths || 0} Baths</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>{property.area || 'N/A'} sqft</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="col-span-6 md:col-span-2">
              <div className="text-base font-semibold text-nordic-dark">${property.price}</div>
              <div className="text-xs text-nordic-dark/50">Type: {property.type === 'rent' ? 'Rent' : 'Sale'}</div>
            </div>

            {/* Status */}
            <div className="col-span-6 md:col-span-2">
              {property.badge === 'Sold' ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span>
                  Sold
                </span>
              ) : property.badge === 'Pending' ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span>
                  Pending
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-hint-of-green text-mosque border border-mosque/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-mosque mr-1.5"></span>
                  Active
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
              <button className="p-2 rounded-lg text-nordic-dark/40 hover:text-mosque hover:bg-hint-of-green/50 transition-all" title="Edit Property">
                <span className="material-icons text-xl">edit</span>
              </button>
              <button className="p-2 rounded-lg text-nordic-dark/40 hover:text-red-600 hover:bg-red-50 transition-all" title="Delete Property">
                <span className="material-icons text-xl">delete_outline</span>
              </button>
            </div>

          </div>
        ))
      )}

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="text-sm text-nordic-dark/60">
          Showing <span className="font-medium text-nordic-dark">{totalItems > 0 ? startIndex + 1 : 0}</span> to <span className="font-medium text-nordic-dark">{Math.min(endIndex, totalItems)}</span> of <span className="font-medium text-nordic-dark">{totalItems}</span> results
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-200 rounded-md text-nordic-dark/80 hover:bg-white disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 text-sm border border-gray-200 rounded-md text-nordic-dark/80 hover:bg-white disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
