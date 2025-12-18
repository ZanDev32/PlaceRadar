-- PlaceRadar: Backfill "Locations".location geometry from coordinates JSON
--
-- This mirrors the SQL executed in backend seeding (backend/src/seed/seedLocations.js).
-- Safe to run multiple times.

UPDATE "Locations"
SET location = ST_SetSRID(
  ST_MakePoint(
    (coordinates->>'lng')::float,
    (coordinates->>'lat')::float
  ),
  4326
)
WHERE coordinates IS NOT NULL;
