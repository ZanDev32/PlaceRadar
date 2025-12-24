import React, { useEffect, useMemo, useState } from 'react';
import { Map, Marker, NavigationControl } from '@vis.gl/react-mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const FALLBACK_CENTER = { lat: -7.754858812561417, lng: 110.3833144208123 }; // Yogyakarta approx
const FALLBACK_ZOOM = 11;

const MapboxPreview = ({ locations = [] }) => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  const [viewState, setViewState] = useState({
    longitude: FALLBACK_CENTER.lng,
    latitude: FALLBACK_CENTER.lat,
    zoom: FALLBACK_ZOOM,
  });

  const locationsList = Array.isArray(locations) ? locations : [];

  const points = useMemo(() => {
    return locationsList
      .map((loc) => {
        const coords = loc?.coordinates;
        const lat = coords?.lat ?? coords?.latitude;
        const lng = coords?.lng ?? coords?.longitude;
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        const url = typeof loc?.google_place_id === 'string' && loc.google_place_id.length > 0
          ? loc.google_place_id
          : `https://www.google.com/maps?q=${lat},${lng}`;
        return { id: loc.id, name: loc.name, lat, lng, url };
      })
      .filter(Boolean);
  }, [locationsList]);

  const center = useMemo(() => {
    if (!points.length) return FALLBACK_CENTER;
    const lat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
    const lng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
    return { lat, lng };
  }, [points]);

  if (!token) {
    return <div className="mapbox_notice">Set VITE_MAPBOX_TOKEN to preview the map.</div>;
  }

  if (!points.length) {
    return <div className="mapbox_notice">No coordinates available for map preview.</div>;
  }

  return (
    <div className="mapbox_container">
      <Map
        mapStyle="mapbox://styles/zandev32/cmjji54ko006501sdbijx537k"
        attributionControl={false}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={token}
      >
        <NavigationControl position="bottom-right" />
        {points.map((p) => (
          <Marker
            key={p.id}
            latitude={p.lat}
            longitude={p.lng}
            anchor="bottom"
            onClick={() => {
              const win = window.open(p.url, '_blank', 'noopener,noreferrer');
              if (win) win.opener = null;
            }}
          >
            <div className="mapbox_marker" title={p.name}>📍</div>
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default MapboxPreview;
