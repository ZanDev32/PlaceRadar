const locationService = require('../services/locations.service');

const getAllLocations = async (req, res) => {
    try {
        const locations = await locationService.getAllLocations();
        return res.status(200).json(locations);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving locations', error });
    }
};

const getLocationById = async (req, res) => {
    const { id } = req.params;
    try {
        const location = await locationService.getLocationById(id);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }
        return res.status(200).json(location);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving location', error });
    }
};

const createLocation = async (req, res) => {
    const newLocation = req.body;
    try {
        const createdLocation = await locationService.createLocation(newLocation);
        return res.status(201).json(createdLocation);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating location', error });
    }
};

const updateLocation = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const updatedLocation = await locationService.updateLocation(id, updatedData);
        if (!updatedLocation) {
            return res.status(404).json({ message: 'Location not found' });
        }
        return res.status(200).json(updatedLocation);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating location', error });
    }
};

const deleteLocation = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLocation = await locationService.deleteLocation(id);
        if (!deletedLocation) {
            return res.status(404).json({ message: 'Location not found' });
        }
        return res.status(200).json({ message: 'Location deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting location', error });
    }
};

const getLocationMaps = async (req, res) => {
    const { id } = req.params;
    try {
        const location = await locationService.getLocationById(id);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        const rawLat = location.coordinates?.lat;
        const rawLng = location.coordinates?.lng;

        const lat = typeof rawLat === 'number' ? rawLat : parseFloat(rawLat);
        const lng = typeof rawLng === 'number' ? rawLng : parseFloat(rawLng);

        const latOk = Number.isFinite(lat) && lat >= -90 && lat <= 90;
        const lngOk = Number.isFinite(lng) && lng >= -180 && lng <= 180;
        if (!latOk || !lngOk) {
            return res.status(422).json({ message: 'Location has no valid coordinates' });
        }

        const googleUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        const googleEmbedUrl = `https://www.google.com/maps?q=${lat},${lng}&output=embed`;

        return res.status(200).json({
            locationId: location.id,
            name: location.name,
            address: location.address,
            coordinates: { lat, lng },
            urls: {
                google: googleUrl,
                google_embed: googleEmbedUrl,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving location maps', error });
    }
};

const getNearbyLocations = async (req, res) => {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ message: 'Latitude (lat) and Longitude (lng) are required' });
    }

    const radiusMeters = radius ? parseFloat(radius) : 1000;

    try {
        const locations = await locationService.getLocationsWithinRadius(
            parseFloat(lat), 
            parseFloat(lng), 
            radiusMeters
        );
        return res.status(200).json(locations);
    } catch (error) {
        console.error('Nearby search error:', error);
        return res.status(500).json({ message: 'Error retrieving nearby locations', error });
    }
};

module.exports = {
    getAllLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation,
    getNearbyLocations,
    getLocationMaps,
};