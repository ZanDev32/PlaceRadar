const Location = require('../models/Location');

const getAllLocations = async () => {
    return Location.find({});
};

const getLocationById = async (id) => {
    return Location.findById(id);
};

const createLocation = async (locationData) => {
    const newLocation = new Location(locationData);
    return newLocation.save();
};

const updateLocation = async (id, locationData) => {
    return Location.findByIdAndUpdate(id, locationData, { new: true });
};

const deleteLocation = async (id) => {
    return Location.findByIdAndDelete(id);
};

module.exports = {
    getAllLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation,
};