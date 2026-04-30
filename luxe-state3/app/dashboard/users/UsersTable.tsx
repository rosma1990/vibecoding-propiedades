"use client";

import { useState } from "react";
import { createClient } from "../../../lib/supabase/client";
import { Breadcrumbs } from "../Breadcrumbs";

type UserWithRole = {
  user_id: string;
  email: string;
  role: string;
  created_at: string;
};

export function UsersTable({ initialUsers }: { initialUsers: UserWithRole[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const supabase = createClient();

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    setOpenDropdownId(null);
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role: newRole }, { onConflict: 'user_id' });

      if (error) throw error;

      setUsers(users.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      alert("Hubo un error al actualizar el rol. Por favor intenta de nuevo.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'broker': return 'Broker';
      case 'agent': return 'Agent';
      default: return 'Usuario';
    }
  };

  const getRoleBadgeClasses = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-nordic-dark text-white';
      case 'broker': return 'bg-mosque/10 text-mosque';
      case 'agent': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <>
      <header className="w-full pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Breadcrumbs />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-nordic-dark">User Directory</h1>
            <p className="text-nordic-dark/60 mt-1 text-sm">Manage user access and roles for your properties.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-nordic-dark/40 group-focus-within:text-mosque text-xl">search</span>
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-white text-nordic-dark shadow-soft placeholder-nordic-dark/30 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-sm" 
                placeholder="Search by name, email..." 
                type="text"
              />
            </div>
            <button className="inline-flex items-center justify-center px-4 py-2.5 border border-mosque text-sm font-medium rounded-lg text-mosque bg-transparent hover:bg-mosque/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mosque transition-colors whitespace-nowrap">
              <span className="material-icons text-lg mr-2">add</span>
              Add User
            </button>
          </div>
        </div>

        <div className="mt-8 flex gap-6 border-b border-nordic-dark/10 overflow-x-auto">
          <button className="pb-3 text-sm font-semibold text-mosque border-b-2 border-mosque whitespace-nowrap">All Users</button>
          <button className="pb-3 text-sm font-medium text-nordic-dark/60 hover:text-nordic-dark transition-colors whitespace-nowrap">Agents</button>
          <button className="pb-3 text-sm font-medium text-nordic-dark/60 hover:text-nordic-dark transition-colors whitespace-nowrap">Brokers</button>
          <button className="pb-3 text-sm font-medium text-nordic-dark/60 hover:text-nordic-dark transition-colors whitespace-nowrap">Admins</button>
        </div>
      </header>

      <main className="flex-grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-12 space-y-4">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-nordic-dark/50 mb-2">
          <div className="col-span-4">User Details</div>
          <div className="col-span-3">Role & Status</div>
          <div className="col-span-3">Performance</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {users.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-nordic-dark/50 shadow-sm border border-gray-100">
            <span className="material-icons text-4xl block mb-2 opacity-50">people_outline</span>
            No users found
          </div>
        ) : (
          users.map((user, index) => {
            const isUpdating = updatingId === user.user_id;
            const isDropdownOpen = openDropdownId === user.user_id;
            
            // Alternate some styles based on index for variety in the mock presentation
            // In a real app this would be based on user state
            const isActive = index % 3 !== 2; 

            return (
              <div 
                key={user.user_id} 
                className={`user-card group relative bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col md:grid md:grid-cols-12 gap-4 items-center transition-colors ${
                  isDropdownOpen ? 'z-50' : 'z-10'
                } ${
                  isUpdating ? 'opacity-50' : 'hover:bg-hint-of-green/20'
                }`}
              >
                {/* User Details */}
                <div className="col-span-12 md:col-span-4 flex items-center w-full">
                  <div className="relative flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-mosque/10 flex items-center justify-center text-mosque font-bold text-xl uppercase ring-2 ring-white">
                      {user.email.charAt(0)}
                    </div>
                    {isActive && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>}
                  </div>
                  <div className="ml-4 overflow-hidden">
                    <div className="text-sm font-bold text-nordic-dark truncate">{user.email.split('@')[0]}</div>
                    <div className="text-xs text-nordic-dark/60 truncate">{user.email}</div>
                    <div className="mt-1 text-[10px] px-2 py-0.5 inline-block bg-gray-50 rounded text-nordic-dark/50 group-hover:bg-white/50 transition-colors font-mono">
                      ID: #{user.user_id.substring(0, 8)}
                    </div>
                  </div>
                </div>

                {/* Role & Status */}
                <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getRoleBadgeClasses(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                  <div className="flex items-center text-xs text-nordic-dark/60">
                    {isActive ? (
                      <><span className="material-icons text-[14px] mr-1 text-mosque">check_circle</span> Active</>
                    ) : (
                      <><span className="material-icons text-[14px] mr-1 text-gray-400">schedule</span> Away</>
                    )}
                  </div>
                </div>

                {/* Performance */}
                <div className="col-span-12 md:col-span-3 w-full grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-nordic-dark/40">Registered</div>
                    <div className="text-sm font-semibold text-nordic-dark">
                      {new Date(user.created_at).toLocaleDateString('es-ES', { year: '2-digit', month: 'short' })}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-nordic-dark/40">Sales (YTD)</div>
                    <div className="text-sm font-semibold text-nordic-dark">-</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-12 md:col-span-2 w-full flex justify-end relative">
                  <button 
                    onClick={() => setOpenDropdownId(isDropdownOpen ? null : user.user_id)}
                    disabled={isUpdating}
                    className={`inline-flex items-center px-4 py-2 border text-xs font-medium rounded-lg focus:outline-none transition-colors w-full md:w-auto justify-center ${
                      user.role === 'admin' 
                        ? 'bg-mosque text-white border-mosque shadow-md hover:bg-mosque/90' 
                        : 'border-gray-200 bg-transparent text-nordic-dark/70 hover:border-nordic-dark hover:text-nordic-dark group-hover:bg-white group-hover:shadow-sm'
                    }`}
                  >
                    Change Role
                    <span className="material-icons text-[16px] ml-2">
                      {isDropdownOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)}></div>
                      <div className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] bg-mosque ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50 origin-top-right animate-fade-in">
                        <div className="py-1" role="menu">
                          <button 
                            onClick={() => handleRoleChange(user.user_id, 'admin')}
                            className="w-full text-left group flex items-center px-4 py-3 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <span className="material-icons text-sm mr-3 text-white/50 group-hover:text-white">shield</span>
                            Administrator
                          </button>
                          <button 
                            onClick={() => handleRoleChange(user.user_id, 'user')}
                            className="w-full text-left group flex items-center px-4 py-3 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <span className="material-icons text-sm mr-3 text-white/50 group-hover:text-white">visibility</span>
                            Viewer (User)
                          </button>
                          <div className="border-t border-white/10 my-1"></div>
                          <button className="w-full text-left group flex items-center px-4 py-3 text-xs text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-colors">
                            <span className="material-icons text-sm mr-3 text-red-300 group-hover:text-red-100">block</span>
                            Suspend User
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Footer / Pagination */}
      <footer className="mt-auto border-t border-nordic-dark/5 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-nordic-dark/60">
                Showing <span className="font-medium text-nordic-dark">{users.length > 0 ? 1 : 0}</span> to <span className="font-medium text-nordic-dark">{Math.min(users.length, 5)}</span> of <span className="font-medium text-nordic-dark">{users.length}</span> users
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-none -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium text-nordic-dark/50 hover:text-mosque transition-colors disabled:opacity-50" disabled>
                  <span className="material-icons text-xl">chevron_left</span>
                </button>
                <button className="z-10 bg-mosque text-white relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md mx-1 shadow-sm">
                  1
                </button>
                <button className="bg-transparent text-nordic-dark/70 hover:bg-white hover:text-mosque relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md mx-1 transition-colors">
                  2
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium text-nordic-dark/50 hover:text-mosque transition-colors">
                  <span className="material-icons text-xl">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
