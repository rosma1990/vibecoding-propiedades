"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);
  
  return (
    <div className="flex items-center text-sm text-nordic-dark/60 mb-4 font-medium animate-fade-in">
      <Link href="/" className="hover:text-mosque transition-colors flex items-center">
        <span className="material-icons text-sm mr-1">home</span>
        Inicio
      </Link>
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;
        const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);
        
        return (
          <span key={path} className="flex items-center">
            <span className="material-icons text-xs mx-2 opacity-50">chevron_right</span>
            {isLast ? (
              <span className="text-mosque font-semibold">{formattedPath}</span>
            ) : (
              <Link href={href} className="hover:text-mosque transition-colors">
                {formattedPath}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}
