
import { useLeaflet } from './useLeaflet';
import { useMapInitialization } from './useMapInitialization';
import { useBusLocation } from './useBusLocation';
import { useStops } from './useStops';
import { useRoute } from './useRoute';
import { LoadingIndicator } from './LoadingIndicator';
import { MapProps } from './types';
import "../../styles/leaflet-styles.css";

export function Map({ 
  busLocation, 
  selectedStop, 
  stops = [], 
  routePoints = [], 
  onStopSelect 
}: MapProps) {
  // Load Leaflet library
  const { leaflet, isLoading, setIsLoading } = useLeaflet();
  
  // Initialize map container and references
  const { 
    mapRef,
    stopsLayerRef,
    mapContainerRef,
    mapInitialized
  } = useMapInitialization(leaflet, isLoading, setIsLoading);

  // Handle bus location updates
  useBusLocation(leaflet, mapRef, busLocation, selectedStop, mapInitialized);
  
  // Handle stops on the map
  useStops(leaflet, mapRef, stopsLayerRef, stops, selectedStop, onStopSelect, mapInitialized);
  
  // Handle route display
  useRoute(leaflet, mapRef, routePoints, mapInitialized);

  return (
    <div className="relative w-full h-full">
      <div id="map" ref={mapContainerRef} className="w-full h-full rounded-md overflow-hidden"></div>
      <LoadingIndicator isLoading={isLoading} />
    </div>
  );
}

export default Map;
