import React from 'react';
import { useLocation } from '../context/LocationContext';
import mascot from '../public/mascot.png';

const Admin = () => {
  const { locations } = useLocation();

  const formatScore = (score) => {
    if (score === null || score === undefined) return 'Lack of necessary info';
    return score;
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto w-full max-w-4xl">
        <img
          src={mascot}
          alt="PlaceRadar mascot"
          className="mb-6 h-24 w-24 rounded-2xl object-contain"
        />
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">PlaceRadar Admin</h1>
        <p className="mt-2 text-zinc-400">Nasi Orak-Arik Ayam Telur😋.</p>

        <nav className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <a
            href="/nagios"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-zinc-200 hover:bg-white hover:text-black transition-colors"
          >
            NagiOS
          </a>
          <a
            href="/pgadmin"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-zinc-200 hover:bg-white hover:text-black transition-colors"
          >
            pgAdmin
          </a>
          <a
            href="/api"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-zinc-200 hover:bg-white hover:text-black transition-colors"
          >
            api
          </a>
        </nav>

        {Array.isArray(locations) && locations.length > 0 ? (
          <div className="mt-10">
            <h2 className="text-xl font-semibold">Locations</h2>
            <ul className="mt-4 grid gap-3">
              {locations.map((loc) => (
                <li
                  key={loc.id}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="font-medium">{loc.name}</div>
                  <div className="mt-1 text-zinc-400">
                    Productivity Score: {formatScore(loc.productivity_score)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-10 text-zinc-500 text-sm">No locations loaded.</div>
        )}
      </div>
    </div>
  );
};

export default Admin;
