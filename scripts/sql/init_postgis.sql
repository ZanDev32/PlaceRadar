-- PlaceRadar DB init (PostGIS + computed columns)

-- 0. Ensure PostGIS is available
CREATE EXTENSION IF NOT EXISTS postgis;

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

-- 4. Productivity Score (Generated Column)
-- Required inputs: wifi_speed_mbps, outlet_per_table, noise_level
-- - noise_level scale: 1..5 (1 = quiet/best, 5 = loud/worst)
-- - wifi_speed_mbps: capped at 200
-- - outlet_per_table: capped at 1.0 (fractional allowed, e.g., 0.5)
-- If any required input is NULL, productivity_score is NULL.

-- Ensure outlet_per_table exists (fractional supported)
ALTER TABLE "Locations"
ADD COLUMN IF NOT EXISTS outlet_per_table numeric(6,2);

DO $$
DECLARE
  gen text;
BEGIN
  SELECT attgenerated
    INTO gen
    FROM pg_attribute
   WHERE attrelid = '"Locations"'::regclass
     AND attname = 'productivity_score'
     AND NOT attisdropped;

  IF gen IS NULL THEN
    EXECUTE '
      ALTER TABLE "Locations"
      ADD COLUMN productivity_score integer
      GENERATED ALWAYS AS (
        CASE
          WHEN wifi_speed_mbps IS NULL OR outlet_per_table IS NULL OR noise_level IS NULL
          THEN NULL
          ELSE LEAST(
            100,
            GREATEST(
              0,
              ROUND(
                100 * (
                  0.4 * (LEAST(GREATEST(wifi_speed_mbps, 0), 200)::numeric / 200::numeric)
                  + 0.3 * (LEAST(GREATEST(outlet_per_table::numeric, 0::numeric), 1.0::numeric) / 1.0::numeric)
                  + 0.3 * ((5::numeric - LEAST(GREATEST(noise_level, 1), 5)::numeric) / 4::numeric)
                )
              )::int
            )
          )
        END
      ) STORED;
    ';
  ELSIF gen <> 's' THEN
    EXECUTE 'ALTER TABLE "Locations" DROP COLUMN productivity_score;';
    EXECUTE '
      ALTER TABLE "Locations"
      ADD COLUMN productivity_score integer
      GENERATED ALWAYS AS (
        CASE
          WHEN wifi_speed_mbps IS NULL OR outlet_per_table IS NULL OR noise_level IS NULL
          THEN NULL
          ELSE LEAST(
            100,
            GREATEST(
              0,
              ROUND(
                100 * (
                  0.4 * (LEAST(GREATEST(wifi_speed_mbps, 0), 200)::numeric / 200::numeric)
                  + 0.3 * (LEAST(GREATEST(outlet_per_table::numeric, 0::numeric), 1.0::numeric) / 1.0::numeric)
                  + 0.3 * ((5::numeric - LEAST(GREATEST(noise_level, 1), 5)::numeric) / 4::numeric)
                )
              )::int
            )
          )
        END
      ) STORED;
    ';
  END IF;
END $$;
