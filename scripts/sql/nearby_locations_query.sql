-- PlaceRadar: Nearby locations query
--
-- This mirrors the raw SQL used by the API for nearby search
-- (backend/src/services/locations.service.js).
--
-- Parameters (psql):
--   \set lat  -7.79
--   \set lng  110.37
--   \set radius 1000

SELECT *,
       ST_DistanceSphere(location, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)) AS distance_meters
FROM "Locations"
WHERE ST_DWithin(
  location::geography,
  ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
  :radius
)
ORDER BY distance_meters ASC;
