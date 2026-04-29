import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import FeaturedCollections from './components/FeaturedCollections/FeaturedCollections';
import NewInMarket from './components/NewInMarket/NewInMarket';
import { getFeaturedProperties, getNewInMarketProperties } from '../lib/properties';

interface HomeProps {
  searchParams: Promise<{ page?: string; location?: string; type?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { page, location, type } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? '1', 10) || 1);

  // A filter is active if location or a non-"all" type chip is selected
  const isFiltered = Boolean(location?.trim()) || (Boolean(type?.trim()) && type?.toLowerCase() !== 'all');

  const [allFeaturedProperties, paginatedResult] = await Promise.all([
    // Only fetch featured if not filtered (avoid unnecessary DB call)
    isFiltered ? Promise.resolve([]) : getFeaturedProperties(),
    getNewInMarketProperties(currentPage, location, type),
  ]);

  // Cap featured collections to a maximum of 2
  const featuredProperties = allFeaturedProperties.slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Hero />

        {/* Only show Featured Collections when no filter is active */}
        {!isFiltered && featuredProperties.length > 0 && (
          <FeaturedCollections properties={featuredProperties} />
        )}

        <NewInMarket
          properties={paginatedResult.properties}
          currentPage={paginatedResult.currentPage}
          totalPages={paginatedResult.totalPages}
          totalCount={paginatedResult.totalCount}
          locationFilter={location}
          typeFilter={type}
        />
      </main>
    </>
  );
}
