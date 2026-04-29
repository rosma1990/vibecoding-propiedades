"use client";

import { Property } from '../../../lib/properties';
import PropertyCard from '../PropertyCard/PropertyCard';
import { useTranslation } from '../../contexts/LanguageContext';

interface FeaturedCollectionsProps {
  properties: Property[];
}

export default function FeaturedCollections({ properties }: FeaturedCollectionsProps) {
  const { dictionary } = useTranslation();

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark">
            {dictionary.featured_collections.title}
          </h2>
          <p className="text-nordic-muted mt-1 text-sm">
            {dictionary.featured_collections.subtitle}
          </p>
        </div>
        <a href="#" className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity">
          {dictionary.featured_collections.view_all} <span className="material-icons text-sm">arrow_forward</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} variant="featured" />
        ))}
      </div>
    </section>
  );
}
