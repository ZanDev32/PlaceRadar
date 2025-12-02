const express = require('express');
const {
	getAllLocations,
	getLocationById,
	createLocation,
	updateLocation,
	deleteLocation,
} = require('../controllers/locations.controller');

const router = express.Router();

// Route to get all locations
router.get('/', getAllLocations);

// Route to get a location by ID
router.get('/:id', getLocationById);

// Route to create a new location
router.post('/', createLocation);

// Route to update an existing location
router.put('/:id', updateLocation);

// Route to delete a location
router.delete('/:id', deleteLocation);

module.exports = router;