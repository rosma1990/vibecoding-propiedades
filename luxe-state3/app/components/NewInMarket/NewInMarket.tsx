import { newInMarket } from '../../data/mockProperties';
import PropertyCard from '../PropertyCard/PropertyCard';

export default function NewInMarket() {
  return (
    <section>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {newInMarket.map((property, index) => {
          // In the original design, last two items are hidden on smaller screens via classes
          // like `hidden xl:flex` and `hidden lg:flex`. We will replicate that logic based on index.
          let className = '';
          if (index === 4) className = 'hidden xl:flex';
          if (index === 5) className = 'hidden lg:flex';
          
          return (
            <PropertyCard
              key={property.id}
              property={property}
              variant="standard"
              className={className}
            />
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <button className="px-8 py-3 bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 hover:border-mosque hover:text-mosque text-nordic-dark dark:text-white font-medium rounded-lg transition-all hover:shadow-md">
          Load more properties
        </button>
      </div>
    </section>
  );
}
