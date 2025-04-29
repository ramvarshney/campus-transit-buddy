
import { useRef, useState, useEffect } from 'react';
import { LeafletMap, LeafletMarker, LeafletCircle } from './types';
import { BusStop } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useBusLocation = (
  leaflet: any,
  mapRef: React.RefObject<LeafletMap>,
  mapInitialized: boolean,
  busLocation?: {
    lat: number;
    lng: number;
    timestamp?: number;
  },
  selectedStop?: BusStop
) => {
  const busMarkerRef = useRef<LeafletMarker | null>(null);
  const notificationCircleRef = useRef<LeafletCircle | null>(null);
  const [hasNotified, setHasNotified] = useState(false);

  // Update bus location
  useEffect(() => {
    if (!leaflet || !mapRef.current || !busLocation || !mapInitialized) return;
    const L = leaflet;
    const map = mapRef.current;

    try {
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

        console.log("Bus marker added at:", busLocation.lat, busLocation.lng);
        
        // Center map on first location update
        map.setView([busLocation.lat, busLocation.lng], 14);
      }

      // Check distance to selected stop for notification
      if (selectedStop && !hasNotified) {
        const distance = map.distance(
          [busLocation.lat, busLocation.lng],
          [selectedStop.location.lat, selectedStop.location.lng]
        );

        console.log(`Distance to selected stop "${selectedStop.name}": ${distance}m`);

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
    } catch (error) {
      console.error("Error updating bus location:", error);
    }
  }, [busLocation, selectedStop, hasNotified, leaflet, mapInitialized]);

  return { hasNotified };
};
