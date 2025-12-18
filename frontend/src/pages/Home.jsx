import React from 'react';
import { useLocation } from '../context/LocationContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

const Home = () => {
    const { locations } = useLocation();

    const formatScore = (score) => {
        if (score === null || score === undefined) return 'Lack of necessary info';
        return score;
    };

    return (
        <div className="bg-black min-h-screen">
            <Navbar />
            <Hero />

            {Array.isArray(locations) && locations.length > 0 ? (
                <div className="w-full px-6 pb-16">
                    <div className="mx-auto w-full max-w-3xl">
                        <h2 className="text-white text-2xl font-semibold mb-4">Locations</h2>
                        <ul className="grid gap-3">
                            {locations.map((loc) => (
                                <li
                                    key={loc.id}
                                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                                >
                                    <div className="text-white font-medium">{loc.name}</div>
                                    <div className="text-zinc-400 mt-1">
                                        Productivity Score: {formatScore(loc.productivity_score)}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Home;