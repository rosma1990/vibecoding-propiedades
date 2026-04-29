import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar/Navbar';
import { getPropertyBySlug } from '../../../lib/properties';
import MapClient from '../../components/PropertyMap/MapClient';
import { cookies } from 'next/headers';
import { getDictionary } from '../../../lib/i18n';
import { defaultLocale, Locale, locales } from '../../../i18n/config';

interface PropertyDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  const resolvedParams = await params;
  const property = await getPropertyBySlug(resolvedParams.slug);

  if (!property) {
    notFound();
  }

  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = locales.includes(localeCookie as Locale)
    ? (localeCookie as Locale)
    : defaultLocale;
  const dictionary = await getDictionary(locale);

  const images = property.images;
  const mainImage = images[0];

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Main Content & Image Gallery */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group">
              <img
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={mainImage}
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {property.is_featured && (
                  <span className="bg-mosque text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">{dictionary.property_details.premium}</span>
                )}
                {property.badge && (
                  <span className="bg-white/90 backdrop-blur text-nordic-dark text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">{property.badge}</span>
                )}
              </div>
              <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic-dark px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2">
                <span className="material-icons text-sm">grid_view</span>
                {dictionary.property_details.view_all_photos}
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
                {images.map((img, idx) => (
                  <div key={idx} className={`flex-none w-48 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer transition-opacity snap-start ${idx === 0 ? 'ring-2 ring-mosque ring-offset-2 ring-offset-background-light' : 'opacity-70 hover:opacity-100'}`}>
                    <img alt={`${property.title} - view ${idx + 1}`} className="w-full h-full object-cover" src={img} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">
              
              {/* Pricing & Contact Info */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-mosque/5">
                <div className="mb-4">
                  <h1 className="text-4xl font-display font-light text-nordic-dark mb-2">{property.price}</h1>
                  <p className="text-nordic-muted font-medium flex items-center gap-1">
                    <span className="material-icons text-mosque text-sm">location_on</span>
                    {property.location}
                  </p>
                </div>
                
                <div className="h-px bg-slate-100 my-6"></div>
                
                <div className="flex items-center gap-4 mb-6">
                  <img alt="Agent" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w" />
                  <div>
                    <h3 className="font-semibold text-nordic-dark">{dictionary.property_details.agent_name}</h3>
                    <div className="flex items-center gap-1 text-xs text-mosque font-medium">
                      <span className="material-icons text-[14px]">star</span>
                      <span>{dictionary.property_details.top_rated_agent}</span>
                    </div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
                      <span className="material-icons text-sm">chat</span>
                    </button>
                    <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
                      <span className="material-icons text-sm">call</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full bg-mosque hover:bg-primary-hover text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group">
                    <span className="material-icons text-xl group-hover:scale-110 transition-transform">calendar_today</span>
                    {dictionary.property_details.schedule_visit}
                  </button>
                  <button className="w-full bg-transparent border border-nordic-dark/10 hover:border-mosque text-nordic-dark/80 hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                    <span className="material-icons text-xl">mail_outline</span>
                    {dictionary.property_details.contact_agent}
                  </button>
                </div>
              </div>

              {/* Map Preview */}
              <div className="bg-white p-2 rounded-xl shadow-sm border border-mosque/5">
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
                  <MapClient locationString={property.location} />
                  <a href="#" className="absolute bottom-2 right-2 bg-white/90 text-xs font-medium px-2 py-1 rounded shadow-sm text-nordic-dark hover:text-mosque z-[1000]">{dictionary.property_details.view_on_map}</a>
                </div>
              </div>

            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-8 lg:row-start-2 lg:-mt-8 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-6 text-nordic-dark">{dictionary.property_details.property_features}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">square_foot</span>
                  <span className="text-xl font-bold text-nordic-dark">{property.area}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">bed</span>
                  <span className="text-xl font-bold text-nordic-dark">{property.beds}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic-muted">{dictionary.property_details.bedrooms}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">shower</span>
                  <span className="text-xl font-bold text-nordic-dark">{property.baths}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic-muted">{dictionary.property_details.bathrooms}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">directions_car</span>
                  <span className="text-xl font-bold text-nordic-dark">2</span>
                  <span className="text-xs uppercase tracking-wider text-nordic-muted">{dictionary.property_details.garage}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-4 text-nordic-dark">{dictionary.property_details.about_this_home}</h2>
              <div className="prose prose-slate max-w-none text-nordic-muted leading-relaxed">
                <p className="mb-4">
                  {dictionary.property_details.about_p1.replace('{location}', property.location)}
                </p>
                <p>
                  {dictionary.property_details.about_p2}
                </p>
              </div>
              <button className="mt-4 text-mosque font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                {dictionary.property_details.read_more}
                <span className="material-icons text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-6 text-nordic-dark">{dictionary.property_details.amenities_title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex items-center gap-3 text-nordic-muted">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>{dictionary.property_details.amenities.smart_home}</span>
                </div>
                <div className="flex items-center gap-3 text-nordic-muted">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>{dictionary.property_details.amenities.pool}</span>
                </div>
                <div className="flex items-center gap-3 text-nordic-muted">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>{dictionary.property_details.amenities.heating_cooling}</span>
                </div>
                <div className="flex items-center gap-3 text-nordic-muted">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>{dictionary.property_details.amenities.ev_charging}</span>
                </div>
                <div className="flex items-center gap-3 text-nordic-muted">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>{dictionary.property_details.amenities.gym}</span>
                </div>
                <div className="flex items-center gap-3 text-nordic-muted">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>{dictionary.property_details.amenities.wine_cellar}</span>
                </div>
              </div>
            </div>

            <div className="bg-mosque/5 p-6 rounded-xl border border-mosque/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-full text-mosque shadow-sm">
                  <span className="material-icons">calculate</span>
                </div>
                <div>
                  <h3 className="font-semibold text-nordic-dark">{dictionary.property_details.estimated_payment}</h3>
                  <p className="text-sm text-nordic-muted">{dictionary.property_details.starting_from} <strong className="text-mosque">$5,430/mo</strong> {dictionary.property_details.with_down}</p>
                </div>
              </div>
              <button className="whitespace-nowrap px-4 py-2 bg-white border border-nordic-dark/10 rounded-lg text-sm font-semibold hover:border-mosque transition-colors text-nordic-dark">
                {dictionary.property_details.calculate_mortgage}
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-slate-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-nordic-muted">
            {dictionary.footer.rights}
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-nordic-muted hover:text-mosque transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
            </a>
            <a href="#" className="text-nordic-muted hover:text-mosque transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
