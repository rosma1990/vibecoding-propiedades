'use client';

import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('./PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-nordic-muted">
      Cargando mapa...
    </div>
  )
});

export default function MapClient({ locationString }: { locationString: string }) {
  return <PropertyMap locationString={locationString} />;
}
