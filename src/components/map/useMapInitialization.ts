
import { useRef, useState, useEffect } from 'react';
import { LeafletMap, LeafletLayerGroup } from './types';
import { toast } from "@/hooks/use-toast";

export const useMapInitialization = (
  leaflet: any, 
  isLoading: boolean, 
  setIsLoading: (loading: boolean) => void
) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const stopsLayerRef = useRef<LeafletLayerGroup | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Initialize map
  useEffect(() => {
    if (!leaflet || !mapContainerRef.current || mapInitialized) return; // Wait until Leaflet is loaded
    
    const L = leaflet;
    
    // Ensure we don't initialize map until element is visible in DOM
    if (!document.getElementById('map')) {
      console.log("Map container not found in DOM, waiting...");
      const checkDomReady = setTimeout(() => {
        setIsLoading(!isLoading); // Toggle to force re-render
      }, 200);
      return () => clearTimeout(checkDomReady);
    }
    
    // Ensure map container has dimensions before initializing
    if (mapContainerRef.current.clientHeight < 10 || mapContainerRef.current.clientWidth < 10) {
      console.log("Map container has insufficient dimensions, waiting...");
      const checkDimensions = setTimeout(() => {
        setIsLoading(!isLoading); // Toggle to force re-render
      }, 200);
      return () => clearTimeout(checkDimensions);
    }
    
    try {
      console.log(`Initializing map with dimensions: ${mapContainerRef.current.clientWidth}x${mapContainerRef.current.clientHeight}`);
      
      // Clear any existing map instance first to avoid conflicts
      if (mapRef.current) {
        mapRef.current.remove();
      }
      
      // Default center on a general area (India)
      const map = L.map('map', {
        attributionControl: true,
        zoomControl: true,
        minZoom: 2,
        maxZoom: 18
      }).setView([20.5937, 78.9629], 5);
      
      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Create layers for stops and route
      stopsLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setMapInitialized(true);
      
      console.log("Map initialized successfully");
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map. Please check your console for details.",
        variant: "destructive"
      });
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMapInitialized(false);
      }
    };
  }, [leaflet, mapInitialized, isLoading, setIsLoading]);

  return {
    mapRef,
    stopsLayerRef,
    mapContainerRef,
    mapInitialized
  };
};
