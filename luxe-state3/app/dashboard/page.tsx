import { createClient } from "../../lib/supabase/server";
import { PropertiesList } from "./PropertiesList";
import { Breadcrumbs } from "./Breadcrumbs";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
          <span className="material-icons">error_outline</span>
          <p>Error cargando propiedades: {error.message}</p>
        </div>
      </main>
    );
  }

  const totalListings = properties?.length || 0;
  const activeProperties = properties?.filter(p => !p.badge?.includes("Sold") && !p.badge?.includes("Vendido")).length || 0;
  const pendingSale = properties?.filter(p => p.badge?.includes("Pending") || p.badge?.includes("Pendiente")).length || 0;

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header Section */}
      <Breadcrumbs />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-nordic-dark tracking-tight">My Properties</h1>
          <p className="text-nordic-dark/60 mt-1">Manage your portfolio and track performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-gray-200 text-nordic-dark hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2">
            <span className="material-icons text-base">filter_list</span> Filter
          </button>
          <Link href="/dashboard/properties/new" className="bg-mosque hover:bg-mosque/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-mosque/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2">
            <span className="material-icons text-base">add</span> Add New Property
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-mosque/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-nordic-dark/60">Total Listings</p>
            <p className="text-2xl font-bold text-nordic-dark mt-1">{totalListings}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-mosque/10 flex items-center justify-center text-mosque">
            <span className="material-icons">apartment</span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-mosque/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-nordic-dark/60">Active Properties</p>
            <p className="text-2xl font-bold text-nordic-dark mt-1">{activeProperties}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-hint-of-green flex items-center justify-center text-mosque">
            <span className="material-icons">check_circle</span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-mosque/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-nordic-dark/60">Pending Sale</p>
            <p className="text-2xl font-bold text-nordic-dark mt-1">{pendingSale}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <span className="material-icons">pending</span>
          </div>
        </div>
      </div>

      {/* Property List Container with Pagination */}
      <PropertiesList properties={properties || []} />
    </main>
  );
}
