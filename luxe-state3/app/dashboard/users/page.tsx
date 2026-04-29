import { createClient } from "../../../lib/supabase/server";
import { UsersTable } from "./UsersTable";

export default async function UsersPage() {
  const supabase = await createClient();

  const { data: users, error } = await supabase.rpc("get_users_with_roles");

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
        <span className="material-icons">error_outline</span>
        <p>Error cargando usuarios: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-nordic-dark">Gestión de Usuarios</h2>
          <p className="text-sm text-nordic-dark/60 mt-1">Administra los roles y accesos de los usuarios de LuxeEstate</p>
        </div>
      </div>

      <UsersTable initialUsers={users || []} />
    </div>
  );
}
