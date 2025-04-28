
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function Map() {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Initialize map if it doesn't exist yet
    if (!mapRef.current) {
      const map = L.map('map').setView([28.6139, 77.2090], 13); // Delhi coordinates
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Add a marker
      L.marker([28.6139, 77.2090])
        .addTo(map)
        .bindPopup('Lovable.ai Location 🚀')
        .openPopup();
      
      // Store the map instance in ref
      mapRef.current = map;
    }
    
    // Cleanup function when component unmounts
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full rounded-md overflow-hidden"></div>
    </div>
  );
}

export default Map;
