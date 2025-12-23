const express = require('express');
const {
	getAllLocations,
	getLocationById,
	createLocation,
	updateLocation,
	deleteLocation,
    getNearbyLocations,
	getLocationMaps,
} = require('../controllers/locations.controller');
const auth = require('../middleware/auth');

const router = express.Router();

// Route to get all locations
router.get('/', getAllLocations);

// Route to get nearby locations
router.get('/nearby', getNearbyLocations);

// Route to get map URLs for a location
router.get('/:id/maps', getLocationMaps);

// Route to get a location by ID
router.get('/:id', getLocationById);

// Route to create a new location
router.post('/', auth, createLocation);

// Route to update an existing location
router.put('/:id', auth, updateLocation);

// Route to delete a location
router.delete('/:id', auth, deleteLocation);

module.exports = router;