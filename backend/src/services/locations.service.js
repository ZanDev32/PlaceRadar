const Location = require('../models/Location');
const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');

const getAllLocations = async () => {
    return Location.findAll();
};

const getLocationById = async (id) => {
    return Location.findByPk(id);
};

const sanitizeLocationInput = (locationData) => {
    if (!locationData || typeof locationData !== 'object') return locationData;
    // productivity_score is a GENERATED column in Postgres; writes should be ignored.
    const { productivity_score, ...sanitized } = locationData;
    return sanitized;
};

const createLocation = async (locationData) => {
    return Location.create(sanitizeLocationInput(locationData));
};

const updateLocation = async (id, locationData) => {
    const [updatedRows, [updatedLocation]] = await Location.update(sanitizeLocationInput(locationData), {
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

const getLocationsWithinRadius = async (lat, lng, radiusInMeters) => {
    const query = `
        SELECT *,
               ST_DistanceSphere(location, ST_SetSRID(ST_MakePoint($lng, $lat), 4326)) as distance_meters
        FROM "Locations"
        WHERE ST_DWithin(
            location::geography,
            ST_SetSRID(ST_MakePoint($lng, $lat), 4326)::geography,
            $radius
        )
        ORDER BY distance_meters ASC;
    `;

    const locations = await sequelize.query(query, {
        bind: { lat, lng, radius: radiusInMeters },
        type: QueryTypes.SELECT,
        model: Location,
        mapToModel: true 
    });

    return locations;
};

module.exports = {
    getAllLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation,
    getLocationsWithinRadius,
};