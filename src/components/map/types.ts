
import { BusStop, RoutePoint } from "@/types";

// Leaflet related types
export interface LeafletMap {
  setView: (center: [number, number], zoom: number) => any;
  remove: () => void;
  distance: (latlng1: [number, number], latlng2: [number, number]) => number;
  fitBounds: (bounds: any, options: any) => any;
}

export interface LeafletMarker {
  setLatLng: (latlng: [number, number]) => void;
  bindPopup: (content: string) => any;
  openPopup: () => void;
  on: (event: string, handler: Function) => void;
}

export interface LeafletLayerGroup {
  addTo: (map: any) => any;
  clearLayers: () => void;
}

export interface LeafletCircle {
  setLatLng: (latlng: [number, number]) => void;
  addTo: (map: any) => any;
}

export interface LeafletPolyline {
  addTo: (map: any) => any;
  getBounds: () => any;
  remove: () => void;
}

// Map component props
export interface MapProps {
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
