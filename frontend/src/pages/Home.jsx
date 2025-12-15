import React from 'react';
import mascot from '../public/mascot.png';
import { useLocation } from '../context/LocationContext';

const Home = () => {
    const { locations } = useLocation();

    const formatScore = (score) => {
        if (score === null || score === undefined) return 'Lack of necessary info';
        return score;
    };

    return (
        <div className="hero">
            <img src={mascot} alt="PlaceRadar mascot" className="hero_image" />
            <h1>Hello PlaceRadar</h1>
            <p>Ini adalah Front-End PlaceRadar.</p>
            <nav>
                <a href="/nagios">NagiOS</a>
                {' | '}
                <a href="/pgadmin">pgAdmin</a>
                {' | '}
                <a href="/api">api</a>
            </nav>

            {Array.isArray(locations) && locations.length > 0 ? (
                <div className="locations">
                    <h2>Locations</h2>
                    <ul className="locations_list">
                        {locations.map((loc) => (
                            <li key={loc.id} className="locations_item">
                                <div className="locations_name">{loc.name}</div>
                                <div className="locations_score">
                                    Productivity Score: {formatScore(loc.productivity_score)}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    );
};

export default Home;