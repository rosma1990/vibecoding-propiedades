import { createClient } from "../../lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
        <span className="material-icons">error_outline</span>
        <p>Error cargando propiedades: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-nordic-dark">Propiedades Registradas</h2>
          <p className="text-sm text-nordic-dark/60 mt-1">Gestiona el catálogo de propiedades de LuxeEstate</p>
        </div>
        <button className="bg-mosque text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-mosque/90 transition-colors shadow-sm flex items-center gap-2 group">
          <span className="material-icons text-sm group-hover:rotate-90 transition-transform">add</span>
          Nueva Propiedad
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-nordic-dark">
            <thead className="bg-background-light/50 border-b border-gray-100 text-xs uppercase text-nordic-dark/60 font-semibold tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4">Propiedad</th>
                <th scope="col" className="px-6 py-4">Ubicación</th>
                <th scope="col" className="px-6 py-4">Precio</th>
                <th scope="col" className="px-6 py-4">Estado</th>
                <th scope="col" className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-nordic-dark/50">
                    <span className="material-icons text-4xl block mb-2 opacity-50">home_work</span>
                    No hay propiedades registradas
                  </td>
                </tr>
              ) : (
                properties?.map((property) => (
                  <tr key={property.id} className="hover:bg-accent/5 transition-colors group">
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative flex-shrink-0">
                          {property.images?.[0] ? (
                            <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-icons absolute inset-0 flex items-center justify-center text-gray-400">image</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-nordic-dark line-clamp-1">{property.title}</p>
                          <p className="text-xs text-nordic-dark/50">ID: {property.id.split('-')[0]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-nordic-dark/80">
                        <span className="material-icons text-[16px] text-mosque/70">location_on</span>
                        <span className="line-clamp-1">{property.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-mosque">
                      ${property.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        property.is_featured 
                          ? 'bg-accent/20 text-accent-dark' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {property.is_featured ? 'Destacada' : 'Estándar'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-nordic-dark/50 hover:text-mosque hover:bg-mosque/10 rounded-md transition-colors" title="Editar">
                          <span className="material-icons text-[20px]">edit</span>
                        </button>
                        <button className="p-1.5 text-nordic-dark/50 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Eliminar">
                          <span className="material-icons text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
