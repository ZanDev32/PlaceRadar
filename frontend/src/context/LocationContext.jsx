import React, { createContext, useContext, useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [locations, setLocations] = useState([]);
    const { fetchLocations } = useApi();

    useEffect(() => {
        const loadLocations = async () => {
            const data = await fetchLocations();
            setLocations(data ?? []);
        };

        loadLocations();
    }, [fetchLocations]);

    return (
        <LocationContext.Provider value={{ locations }}>
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