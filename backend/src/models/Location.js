const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    wifiSpeed: { type: Number, required: true },
    powerOutlets: { type: Number, required: true },
    noiseLevel: { type: Number, required: true },
    reviews: { type: [String], default: [] }
});

module.exports = mongoose.model('Location', LocationSchema);