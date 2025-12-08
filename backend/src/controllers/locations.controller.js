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
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting location', error });
    }
};

module.exports = {
    getAllLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation,
};