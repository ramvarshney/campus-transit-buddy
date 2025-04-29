
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

export const useLeaflet = () => {
  const [leaflet, setLeaflet] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (leaflet) return; // Only load once
    
    const loadLeaflet = async () => {
      try {
        // Use a script tag to load leaflet globally
        if (!document.querySelector('script[src*="leaflet.js"]')) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
          script.crossOrigin = '';
          
          script.onload = () => {
            // Access the global L object
            const L = window.L;
            setLeaflet(L);
            setIsLoading(false);
            console.log("Leaflet loaded successfully");
          };
          
          script.onerror = (err) => {
            console.error('Failed to load Leaflet script:', err);
            toast({
              title: "Error",
              description: "Failed to load map library. Please refresh the page.",
              variant: "destructive"
            });
          };
          
          document.head.appendChild(script);
        } else {
          // If script already exists, just set the leaflet reference
          setLeaflet(window.L);
          setIsLoading(false);
        }
        
        // Also add the CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          link.crossOrigin = '';
          document.head.appendChild(link);
        }
      } catch (err) {
        console.error('Failed to load Leaflet:', err);
        toast({
          title: "Error",
          description: "Failed to load map library. Please refresh the page.",
          variant: "destructive"
        });
      }
    };
    
    loadLeaflet();
  }, []);

  return { leaflet, isLoading, setIsLoading };
};

// Add this to the global Window interface
declare global {
  interface Window {
    L: any;
  }
}
