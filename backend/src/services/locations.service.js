const Location = require('../models/Location');

const getAllLocations = async () => {
    return Location.findAll();
};

const getLocationById = async (id) => {
    return Location.findByPk(id);
};

const createLocation = async (locationData) => {
    return Location.create(locationData);
};

const updateLocation = async (id, locationData) => {
    const [updatedRows, [updatedLocation]] = await Location.update(locationData, {
        where: { id },
        returning: true,
    });
    return updatedLocation;
};

const deleteLocation = async (id) => {
    const location = await Location.findByPk(id);
    if (location) {
        await location.destroy();
        return location;
    }
    return null;
};

module.exports = {
    getAllLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation,
};