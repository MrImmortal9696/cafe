"use client";

import { useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MAP_STYLE_URL =
  "https://maps.geoapify.com/v1/styles/osm-liberty/style.json";
const API_KEY =
  process.env.NEXT_PUBLIC_MAP_API_KEY || "9f4b7abe4a2b45e5948c366bad0de3bb";

const MapComponent = ({ lat = "55.8578688", long = "-4.2439858" }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `${MAP_STYLE_URL}?apiKey=${API_KEY}`,
      center: [long, lat],
      zoom: 16, // Adjust the zoom level as desired
      pitch: 0,
      bearing: 0,
      antialias: true,
    });

    mapRef.current = map;

    // Add map controls
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }));
    map.dragRotate.enable();
    map.touchZoomRotate.enableRotation();

    // Add marker at initial position
    markerRef.current = new maplibregl.Marker()
      .setLngLat([long, lat])
      .addTo(map);
  }, [lat, long]);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  return (
    <div className="relative w-full h-full overflow-hidden flexCentercol">
      <div ref={mapContainerRef} className="m-auto w-full h-full" />
    </div>
  );
};

export default MapComponent;
