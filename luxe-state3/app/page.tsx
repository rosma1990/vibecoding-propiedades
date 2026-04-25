import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import FeaturedCollections from './components/FeaturedCollections/FeaturedCollections';
import NewInMarket from './components/NewInMarket/NewInMarket';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Hero />
        <FeaturedCollections />
        <NewInMarket />
      </main>
    </>
  );
}
