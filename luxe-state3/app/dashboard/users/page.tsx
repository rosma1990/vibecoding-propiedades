import { createClient } from "../../../lib/supabase/server";
import { UsersTable } from "./UsersTable";

export default async function UsersPage() {
  const supabase = await createClient();

  const { data: users, error } = await supabase.rpc("get_users_with_roles");

  if (error) {
    return (
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
          <span className="material-icons">error_outline</span>
          <p>Error cargando usuarios: {error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <div className="w-full flex-grow flex flex-col animate-fade-in">
      <UsersTable initialUsers={users || []} />
    </div>
  );
}
