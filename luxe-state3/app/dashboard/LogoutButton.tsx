"use client";

import { useAuth } from "../contexts/AuthContext";

export function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <button 
      onClick={signOut}
      className="p-2 ml-2 rounded-full text-nordic-dark/40 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center"
      title="Cerrar sesión"
    >
      <span className="material-icons text-xl">logout</span>
    </button>
  );
}
