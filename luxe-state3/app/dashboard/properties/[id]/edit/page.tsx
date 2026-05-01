import { PropertyForm } from "../../components/PropertyForm";
import Link from "next/link";
import { getPropertyBySlug } from "../../../../../lib/properties";
import { notFound } from "next/navigation";

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const property = await getPropertyBySlug(params.id);

  if (!property) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium font-sf-pro">
              <li><Link className="hover:text-mosque transition-colors" href="/dashboard">Properties</Link></li>
              <li><span className="material-icons text-xs text-gray-400">chevron_right</span></li>
              <li aria-current="page" className="text-nordic-dark">Edit Property</li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-nordic-dark tracking-tight mb-2 line-clamp-1">Edit {property.title}</h1>
            <p className="text-base text-gray-500 max-w-2xl font-normal font-sf-pro">
              Update the details below. Fields marked with * are mandatory.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard" className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-nordic-dark hover:bg-gray-50 transition-colors font-medium font-sf-pro text-sm inline-flex items-center justify-center">
            Cancel
          </Link>
          <button 
            type="submit" 
            form="property-form"
            className="px-5 py-2.5 rounded-lg bg-mosque hover:bg-mosque/90 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-sf-pro text-sm">
            <span className="material-icons text-sm">save</span>
            Save Changes
          </button>
        </div>
      </header>
      <PropertyForm initialData={property} />
    </main>
  );
}
