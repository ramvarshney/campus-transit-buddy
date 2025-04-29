
import { useRef, useEffect } from 'react';
import { LeafletMap, LeafletPolyline } from './types';
import { RoutePoint } from '@/types';

export const useRoute = (
  leaflet: any,
  mapRef: React.RefObject<LeafletMap>,
  routePoints: RoutePoint[],
  mapInitialized: boolean
) => {
  const routeLayerRef = useRef<LeafletPolyline | null>(null);

  // Update route path
  useEffect(() => {
    if (!leaflet || !mapRef.current || !mapInitialized) return;
    const L = leaflet;
    const map = mapRef.current;

    // Remove existing route
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
    }

    // Add new route if points exist
    if (routePoints.length > 1) {
      const latLngs = routePoints.map((point) => [point.lat, point.lng]);
      
      routeLayerRef.current = L.polyline(latLngs as [number, number][], {
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
  }, [routePoints, leaflet, mapInitialized]);
};
