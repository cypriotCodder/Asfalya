"use client";

import dynamic from 'next/dynamic';

const MechanicMap = dynamic(() => import('./MechanicMap'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-zinc-100 rounded-lg flex items-center justify-center">Loading Map...</div>
});

export default function MechanicMapLoader() {
    return <MechanicMap />;
}
