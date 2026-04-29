"use client";

import { useState } from "react";
import { createClient } from "../../../lib/supabase/client";

type UserWithRole = {
  user_id: string;
  email: string;
  role: string;
  created_at: string;
};

export function UsersTable({ initialUsers }: { initialUsers: UserWithRole[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const supabase = createClient();

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
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

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden relative">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-nordic-dark">
          <thead className="bg-background-light/50 border-b border-gray-100 text-xs uppercase text-nordic-dark/60 font-semibold tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-4">Usuario</th>
              <th scope="col" className="px-6 py-4">Fecha de Registro</th>
              <th scope="col" className="px-6 py-4">Rol</th>
              <th scope="col" className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-nordic-dark/50">
                  <span className="material-icons text-4xl block mb-2 opacity-50">people_outline</span>
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.user_id} className="hover:bg-accent/5 transition-colors group">
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-mosque/10 text-mosque flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-nordic-dark line-clamp-1">{user.email}</p>
                        <p className="text-xs text-nordic-dark/50 font-mono" title={user.user_id}>ID: {user.user_id.split('-')[0]}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-nordic-dark/80">
                    {new Date(user.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-mosque/10 text-mosque' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                      disabled={updatingId === user.user_id}
                      className="bg-white border border-gray-200 text-nordic-dark text-sm rounded-lg focus:ring-mosque focus:border-mosque block w-full p-2"
                    >
                      <option value="user">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {updatingId && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
           <span className="material-icons animate-spin text-mosque text-3xl">autorenew</span>
        </div>
      )}
    </div>
  );
}
