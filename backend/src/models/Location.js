const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Location = sequelize.define('Location', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    coordinates: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    location: {
        type: DataTypes.GEOMETRY('POINT', 4326),
        allowNull: true,
    },
    google_place_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pricing_min_spend: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: null,
    },
    wifi_speed_mbps: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    outlet_per_table: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
        defaultValue: null,
    },
    noise_level: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    productivity_score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    facilities: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
    },
    is_24_hours: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    opening_hours: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: null,
    },
    social_media: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: null,
    },
    rating_average: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    review_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    save_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    like_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
});

module.exports = Location;