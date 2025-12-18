-- PlaceRadar: Productivity Score (Generated Column)
--
-- This mirrors the SQL applied from code in backend/src/config/db.js.
-- Safe to run multiple times.
--
-- Assumptions:
-- - "Locations" table exists (created by Sequelize sync).
-- - noise_level is numeric scale 1..5 (1 = quiet/best, 5 = loud/worst).
-- - wifi_speed_mbps is Mbps.
-- - outlet_per_table is outlets per table and may be fractional (e.g., 0.5).
--
-- Scoring:
-- - Wi-Fi: 40% (cap at 200 Mbps)
-- - Outlets: 30% (scaled; cap at 1.0 per table)
-- - Noise: 30% (1->100, 3->50, 5->0)
--
-- If any required input is NULL, productivity_score is NULL.

DO $$
DECLARE
  gen text;
BEGIN
  IF to_regclass('"Locations"') IS NULL THEN
    RAISE NOTICE '"Locations" table not found. Run this after the backend has created tables (sequelize.sync).';
    RETURN;
  END IF;

  -- Drop generated column if present (mirrors backend sync workaround).
  EXECUTE 'ALTER TABLE "Locations" DROP COLUMN IF EXISTS productivity_score;';

  -- Ensure outlet_per_table exists (fractional supported).
  IF NOT EXISTS (
    SELECT 1
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'Locations'
       AND column_name = 'outlet_per_table'
  ) THEN
    EXECUTE 'ALTER TABLE "Locations" ADD COLUMN outlet_per_table numeric(6,2);';
  END IF;

  -- Create as STORED generated column.
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
END $$;
