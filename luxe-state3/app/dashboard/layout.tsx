import Link from "next/link";
import { ReactNode } from "react";
import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "./LogoutButton";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Obtenemos el rol del usuario para mostrarlo en el perfil
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  const userRole = roleData?.role === 'admin' ? 'Administrador' : 'Usuario';
  const userName = user.user_metadata?.full_name || 'Agente Luxe';

  return (
    <div className="bg-background-light font-display text-nordic-dark min-h-screen flex flex-col">
      {/* Navbar Superior */}
      <nav className="sticky top-0 z-50 bg-white border-b border-mosque/10 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Primary Nav */}
            <div className="flex items-center gap-12">
              <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
                <div className="w-8 h-8 rounded bg-mosque flex items-center justify-center text-white font-bold text-lg group-hover:bg-mosque/90 transition-colors">
                  <span className="material-icons text-xl">real_estate_agent</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-nordic-dark">LuxeEstate</span>
              </Link>
              
              <div className="hidden md:flex space-x-8">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-mosque/30 text-sm font-medium text-nordic-dark/60 hover:text-mosque transition-colors"
                >
                  Propiedades
                </Link>
                <Link 
                  href="/dashboard/users"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-mosque/30 text-sm font-medium text-nordic-dark/60 hover:text-mosque transition-colors"
                >
                  Usuarios
                </Link>
                <Link 
                  href="#"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-mosque/30 text-sm font-medium text-nordic-dark/60 hover:text-mosque transition-colors opacity-50 cursor-not-allowed"
                >
                  Finanzas
                </Link>
              </div>
            </div>

            {/* Secondary Nav / Profile */}
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full text-nordic-dark/40 hover:text-mosque hover:bg-mosque/5 transition-colors relative">
                <span className="material-icons text-xl">notifications_none</span>
                {/* Indicador de notificación */}
                <span className="absolute top-2 right-2 block h-1.5 w-1.5 rounded-full bg-red-500"></span>
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-semibold text-nordic-dark">{userName}</span>
                  <span className="text-xs text-nordic-dark/60">{userRole}</span>
                </div>
                <div className="h-9 w-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white flex items-center justify-center text-nordic-dark/50 cursor-pointer">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="material-icons">person</span>
                  )}
                </div>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col relative w-full">
        {children}
      </div>

      {/* Footer del Dashboard */}
      <footer className="mt-auto border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-nordic-dark/40">
            © {new Date().getFullYear()} LuxeEstate Management. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
