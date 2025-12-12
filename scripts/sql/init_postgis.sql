-- 1. Add the Geometry Column
ALTER TABLE "Locations" 
ADD COLUMN IF NOT EXISTS location GEOMETRY(Point, 4326);

-- 2. Backfill Data (Populate geometry from existing JSON lat/lng)
UPDATE "Locations"
SET location = ST_SetSRID(ST_MakePoint(
    (coordinates->>'lng')::float, 
    (coordinates->>'lat')::float
), 4326)
WHERE coordinates IS NOT NULL 
  AND coordinates->>'lat' IS NOT NULL 
  AND coordinates->>'lng' IS NOT NULL;

-- 3. Create Spatial Index (Crucial for performance)
-- We index the geography cast to support fast meter-based queries
CREATE INDEX IF NOT EXISTS locations_location_geog_idx 
ON "Locations" 
USING GIST ((location::geography));
