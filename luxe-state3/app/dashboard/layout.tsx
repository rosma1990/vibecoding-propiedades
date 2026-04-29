import Link from "next/link";
import { ReactNode } from "react";
import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background-light flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex-shrink-0 z-20 shadow-sm relative">
        <div className="p-6 flex items-center justify-between md:justify-center border-b border-gray-100">
          <Link href="/" className="inline-flex items-center gap-2 text-mosque font-bold text-xl hover:opacity-90 transition-opacity">
            <span className="material-icons bg-mosque text-white p-2 rounded-lg text-xl shadow-sm">real_estate_agent</span>
            LuxeEstate
          </Link>
        </div>
        
        <div className="p-4 space-y-2">
          <p className="text-xs font-semibold text-nordic-dark/50 uppercase tracking-wider mb-4 px-2">
            Administración
          </p>
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 px-4 py-3 text-nordic-dark font-medium rounded-lg hover:bg-accent/10 hover:text-mosque transition-colors"
          >
            <span className="material-icons text-mosque/70">dashboard</span>
            Propiedades
          </Link>
          <Link 
            href="/dashboard/users" 
            className="flex items-center gap-3 px-4 py-3 text-nordic-dark font-medium rounded-lg hover:bg-accent/10 hover:text-mosque transition-colors"
          >
            <span className="material-icons text-mosque/70">people</span>
            Usuarios
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 p-4 sm:p-6 flex items-center justify-between z-10 relative shadow-sm">
          <h1 className="text-2xl font-bold text-nordic-dark">Panel de Control</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-background-light px-4 py-2 rounded-full border border-gray-100 shadow-inner">
              <span className="material-icons text-mosque text-sm">account_circle</span>
              <span className="text-sm font-medium text-nordic-dark max-w-[150px] truncate">
                {user.email}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 relative">
           {/* Decorative Background Elements */}
          <div className="absolute inset-0 pointer-events-none opacity-20 -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
