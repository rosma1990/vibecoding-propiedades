import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import FeaturedCollections from './components/FeaturedCollections/FeaturedCollections';
import NewInMarket from './components/NewInMarket/NewInMarket';
import { getFeaturedProperties, getNewInMarketProperties } from '../lib/properties';

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? '1', 10) || 1);

  const [featuredProperties, paginatedResult] = await Promise.all([
    getFeaturedProperties(),
    getNewInMarketProperties(currentPage),
  ]);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Hero />
        <FeaturedCollections properties={featuredProperties} />
        <NewInMarket
          properties={paginatedResult.properties}
          currentPage={paginatedResult.currentPage}
          totalPages={paginatedResult.totalPages}
        />
      </main>
    </>
  );
}
