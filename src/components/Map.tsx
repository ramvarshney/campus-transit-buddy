
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from "@/hooks/use-toast";
import { BusStop, RoutePoint } from "@/types";

interface MapProps {
  busLocation?: {
    lat: number;
    lng: number;
    timestamp?: number;
  };
  selectedStop?: BusStop;
  stops?: BusStop[];
  routePoints?: RoutePoint[];
  onStopSelect?: (stop: BusStop) => void;
}

export function Map({ 
  busLocation, 
  selectedStop, 
  stops = [], 
  routePoints = [], 
  onStopSelect 
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const busMarkerRef = useRef<L.Marker | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const stopsLayerRef = useRef<L.LayerGroup | null>(null);
  const notificationCircleRef = useRef<L.Circle | null>(null);
  const [hasNotified, setHasNotified] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      // Default center on a general area (can be adjusted)
      const map = L.map("map").setView([20.5937, 78.9629], 5);
      
      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Create layers for stops and route
      stopsLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update bus location
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !busLocation) return;

    // Create or update bus marker
    if (busMarkerRef.current) {
      busMarkerRef.current.setLatLng([busLocation.lat, busLocation.lng]);
    } else {
      // Create a custom bus icon
      const busIcon = L.divIcon({
        className: 'bus-marker',
        html: `<div class="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 6v12m8-12v12M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 9h16"></path>
                </svg>
              </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      busMarkerRef.current = L.marker([busLocation.lat, busLocation.lng], {
        icon: busIcon
      }).addTo(map).bindPopup('Bus Current Location');

      // Center map on first location update
      map.setView([busLocation.lat, busLocation.lng], 14);
    }

    // Check distance to selected stop for notification
    if (selectedStop && !hasNotified) {
      const distance = map.distance(
        [busLocation.lat, busLocation.lng],
        [selectedStop.location.lat, selectedStop.location.lng]
      );

      // If within 500 meters and hasn't notified yet
      if (distance <= 500 && !hasNotified) {
        toast({
          title: "Bus Approaching",
          description: `The bus is now within 500 meters of ${selectedStop.name}!`,
          duration: 10000
        });
        
        setHasNotified(true);

        // Create a pulse effect around the bus
        if (notificationCircleRef.current) {
          notificationCircleRef.current.setLatLng([busLocation.lat, busLocation.lng]);
        } else {
          notificationCircleRef.current = L.circle([busLocation.lat, busLocation.lng], {
            radius: 500,
            color: 'rgba(34, 197, 94, 0.6)',
            fillColor: 'rgba(34, 197, 94, 0.2)',
            fillOpacity: 0.5,
            weight: 2,
            className: 'animate-pulse-ring'
          }).addTo(map);
        }
      }
    }
  }, [busLocation, selectedStop, hasNotified]);

  // Update stops on map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !stopsLayerRef.current) return;

    // Clear existing stops
    stopsLayerRef.current.clearLayers();

    // Add stop markers
    stops.forEach((stop) => {
      const isSelected = selectedStop?.id === stop.id;

      // Create custom stop icon
      const stopIcon = L.divIcon({
        className: 'stop-marker',
        html: `<div class="${isSelected ? 'w-6 h-6 bg-accent' : 'w-4 h-4 bg-gray-500'} rounded-full flex items-center justify-center text-white">
                ${isSelected ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>' : ''}
              </div>`,
        iconSize: isSelected ? [24, 24] : [16, 16],
        iconAnchor: isSelected ? [12, 12] : [8, 8]
      });

      // Create marker and add click handler
      const marker = L.marker([stop.location.lat, stop.location.lng], {
        icon: stopIcon
      }).addTo(stopsLayerRef.current).bindPopup(`<b>${stop.name}</b>${stop.eta ? `<br>ETA: ${stop.eta} minutes` : ''}`);

      if (onStopSelect) {
        marker.on('click', () => onStopSelect(stop));
      }

      // If this is the selected stop, open its popup
      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [stops, selectedStop, onStopSelect]);

  // Update route path
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing route
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
    }

    // Add new route if points exist
    if (routePoints.length > 1) {
      const latLngs = routePoints.map((point) => [point.lat, point.lng]);
      
      routeLayerRef.current = L.polyline(latLngs as L.LatLngExpression[], {
        color: 'hsl(var(--primary))',
        weight: 4,
        opacity: 0.7,
        lineJoin: 'round'
      }).addTo(map);

      // Fit map to show entire route
      map.fitBounds(routeLayerRef.current.getBounds(), {
        padding: [50, 50]
      });
    }
  }, [routePoints]);

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full rounded-md overflow-hidden"></div>
    </div>
  );
}

export default Map;
