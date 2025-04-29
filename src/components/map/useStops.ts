
import { useEffect } from 'react';
import { LeafletMap, LeafletLayerGroup } from './types';
import { BusStop } from '@/types';

export const useStops = (
  leaflet: any,
  mapRef: React.RefObject<LeafletMap>,
  stopsLayerRef: React.RefObject<LeafletLayerGroup>,
  stops: BusStop[],
  selectedStop?: BusStop,
  onStopSelect?: (stop: BusStop) => void,
  mapInitialized: boolean
) => {
  // Update stops on map
  useEffect(() => {
    if (!leaflet || !mapRef.current || !stopsLayerRef.current || !mapInitialized) return;
    const L = leaflet;
    const map = mapRef.current;

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
  }, [stops, selectedStop, onStopSelect, leaflet, mapInitialized]);
};
