import { useState, useCallback } from 'react';
import axios from 'axios';

const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchLocations = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/api/locations');
            return response.data;
        } catch (err) {
            setError(err?.message || 'An error occurred');
            return undefined;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchLocationDetails = useCallback(async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/api/locations/${id}`);
            return response.data;
        } catch (err) {
            setError(err?.message || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { fetchLocations, fetchLocationDetails, loading, error };
};

export default useApi;