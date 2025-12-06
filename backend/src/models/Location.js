const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Location = sequelize.define('Location', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    wifiSpeed: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    powerOutlets: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    noiseLevel: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reviews: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    }
});

module.exports = Location;