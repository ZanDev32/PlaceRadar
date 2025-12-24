import React from 'react';
import mascot from '../public/mascot.png';
import { useLocation } from '../context/LocationContext';
import MapboxPreview from '../components/MapboxPreview';

const Home = () => {
    const { locations, getMapLink, mapLinkLoading, mapLinkError } = useLocation();

    const formatScore = (score) => {
        if (score === null || score === undefined) return 'Lack of necessary info';
        return score;
    };

    const hasValidCoords = (loc) => {
        const coords = loc?.coordinates;
        const lat = coords?.lat ?? coords?.latitude;
        const lng = coords?.lng ?? coords?.longitude;
        return Number.isFinite(lat) && Number.isFinite(lng);
    };

    const handleOpenMap = async (loc) => {
        if (!loc?.id || !hasValidCoords(loc)) return;
        const directUrl = typeof loc?.google_place_id === 'string' && loc.google_place_id.length > 0
            ? loc.google_place_id
            : null;

        const url = directUrl ?? await getMapLink(loc.id);
        if (!url) return;

        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) {
            newWindow.opener = null;
        }
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

            <MapboxPreview locations={locations} />

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
                                <div className="locations_actions">
                                    <button
                                        type="button"
                                        onClick={() => handleOpenMap(loc)}
                                        disabled={!hasValidCoords(loc) || mapLinkLoading?.[loc.id]}
                                    >
                                        {mapLinkLoading?.[loc.id] ? 'Loading map…' : 'Open Map'}
                                    </button>
                                    {!hasValidCoords(loc) ? (
                                        <span className="locations_action_note">Map link unavailable</span>
                                    ) : null}
                                    {mapLinkError?.[loc.id] ? (
                                        <span className="locations_action_error">{mapLinkError[loc.id]}</span>
                                    ) : null}
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