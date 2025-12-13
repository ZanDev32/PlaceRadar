const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { connectDB, sequelize } = require('../config/db');
const Location = require('../models/Location');

const SEED_PATH = path.resolve(__dirname, '../../scripts/seed/locations.json');
const UPDATE_FIELDS = [
  'name',
  'description',
  'address',
  'coordinates',
  'google_place_id',
  'images',
  'type',
  'pricing_min_spend',
  'wifi_speed_mbps',
  'outlet_per_table',
  'noise_level',
  'facilities',
  'is_24_hours',
  'opening_hours',
  'social_media',
  'rating_average',
  'review_count',
  'save_count',
  'like_count',
];

const INSERT_FIELDS = ['id', ...UPDATE_FIELDS];

const isObject = (val) => val !== null && typeof val === 'object' && !Array.isArray(val);

function validateRecord(record, index) {
  const prefix = `Record ${index + 1}`;
  const requiredStrings = ['id', 'name', 'address', 'google_place_id'];
  requiredStrings.forEach((field) => {
    if (!record[field] || typeof record[field] !== 'string') {
      throw new Error(`${prefix}: ${field} must be a non-empty string`);
    }
  });

  if (record.coordinates && !isObject(record.coordinates)) {
    throw new Error(`${prefix}: coordinates must be an object`);
  }
  if (record.pricing_min_spend && !isObject(record.pricing_min_spend)) {
    throw new Error(`${prefix}: pricing_min_spend must be an object`);
  }
  if (record.facilities && !isObject(record.facilities)) {
    throw new Error(`${prefix}: facilities must be an object`);
  }
  if (record.opening_hours && !isObject(record.opening_hours)) {
    throw new Error(`${prefix}: opening_hours must be an object`);
  }
  if (record.social_media && !isObject(record.social_media)) {
    throw new Error(`${prefix}: social_media must be an object`);
  }
  if (record.images && !Array.isArray(record.images)) {
    throw new Error(`${prefix}: images must be an array`);
  }

  const numberFields = [
    'wifi_speed_mbps',
    'outlet_per_table',
    'noise_level',
    'rating_average',
    'review_count',
    'save_count',
    'like_count',
  ];
  numberFields.forEach((field) => {
    if (record[field] !== undefined && record[field] !== null && typeof record[field] !== 'number') {
      throw new Error(`${prefix}: ${field} must be a number when provided`);
    }
  });
  if (record.is_24_hours !== undefined && record.is_24_hours !== null && typeof record.is_24_hours !== 'boolean') {
    throw new Error(`${prefix}: is_24_hours must be a boolean when provided`);
  }
}

function loadSeedData() {
  const raw = fs.readFileSync(SEED_PATH, 'utf-8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Seed file must be a non-empty array');
  }

  const idSet = new Set();
  const placeIdSet = new Set();

  data.forEach((record, index) => {
    validateRecord(record, index);
    if (idSet.has(record.id)) {
      throw new Error(`Duplicate id found in seed file: ${record.id}`);
    }
    if (placeIdSet.has(record.google_place_id)) {
      throw new Error(`Duplicate google_place_id found in seed file: ${record.google_place_id}`);
    }
    idSet.add(record.id);
    placeIdSet.add(record.google_place_id);
  });

  return data;
}

async function main() {
  await connectDB();
  const seedData = loadSeedData();
  const seedIds = seedData.map((r) => r.id);

  const transaction = await sequelize.transaction();
  try {
    const existingIds = await Location.findAll({ attributes: ['id'], raw: true, transaction });
    const existingIdSet = new Set(existingIds.map((row) => row.id));

    await Location.bulkCreate(seedData, {
      fields: INSERT_FIELDS,
      updateOnDuplicate: UPDATE_FIELDS,
      returning: true,
      transaction,
    });

    const deletedCount = await Location.destroy({
      where: { id: { [Op.notIn]: seedIds } },
      transaction,
    });

    await transaction.commit();

    const insertedCount = seedData.filter((r) => !existingIdSet.has(r.id)).length;
    const updatedCount = seedData.length - insertedCount;

    console.log(`Seeding complete: inserted=${insertedCount}, updated=${updatedCount}, deleted=${deletedCount}`);

    // Backfill Geometry column
    try {
        await sequelize.query(`
            UPDATE "Locations"
            SET location = ST_SetSRID(ST_MakePoint(
                (coordinates->>'lng')::float, 
                (coordinates->>'lat')::float
            ), 4326)
            WHERE coordinates IS NOT NULL;
        `);
        console.log('Location geometry updated.');
    } catch (err) {
        console.error('Failed to update location geometry:', err);
    }

    process.exit(0);
  } catch (error) {
    await transaction.rollback();
    console.error('Seeding failed:', error.message || error);
    process.exit(1);
  }
}

main();
