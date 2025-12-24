import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useApi from '../hooks/useApi';

const LocationContext = createContext();
const MAP_LINK_TTL_MS = 10 * 60 * 1000;

export const LocationProvider = ({ children }) => {
    const [locations, setLocations] = useState([]);
    const [mapLinks, setMapLinks] = useState({});
    const [mapLinkLoading, setMapLinkLoading] = useState({});
    const [mapLinkError, setMapLinkError] = useState({});
    const { fetchLocations, fetchLocationMaps } = useApi();

    useEffect(() => {
        const loadLocations = async () => {
            const data = await fetchLocations();
            setLocations(data ?? []);
        };

        loadLocations();
    }, [fetchLocations]);

    const getMapLink = useCallback(async (id) => {
        if (!id) return null;

        const cached = mapLinks[id];
        if (cached && cached.expiresAt > Date.now()) {
            return cached.url;
        }

        setMapLinkLoading((prev) => ({ ...prev, [id]: true }));
        setMapLinkError((prev) => ({ ...prev, [id]: null }));

        try {
            const data = await fetchLocationMaps(id);
            const url = data?.google_maps_url || data?.urls?.google || data?.google;
            if (!url) {
                throw new Error('Map link unavailable');
            }

            setMapLinks((prev) => ({
                ...prev,
                [id]: {
                    url,
                    expiresAt: Date.now() + MAP_LINK_TTL_MS,
                },
            }));

            return url;
        } catch (err) {
            const message = err?.message || 'Failed to load map link';
            setMapLinkError((prev) => ({ ...prev, [id]: message }));
            return null;
        } finally {
            setMapLinkLoading((prev) => ({ ...prev, [id]: false }));
        }
    }, [fetchLocationMaps, mapLinks]);

    return (
        <LocationContext.Provider value={{ locations, getMapLink, mapLinkLoading, mapLinkError }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};