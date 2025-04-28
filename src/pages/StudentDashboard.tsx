
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import { Map } from "@/components/Map";
import { Bus, BusStop, RoutePoint, UserLocation } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, Bus as BusIcon, Clock, MapPin, Route } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function StudentDashboard() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  
  // Mock route points - in a real app, these would come from a routing API or database
  // For demo purposes, we'll create a simple route
  useEffect(() => {
    if (selectedBus) {
      // In a real app, you would fetch the actual route from an API
      fetchBusRoute(selectedBus.id).then(route => {
        setRoutePoints(route);
      });
    }
  }, [selectedBus]);
  
  // Fetch bus data from Firebase
  useEffect(() => {
    const busesRef = ref(database, 'buses');
    const unsubscribe = onValue(busesRef, (snapshot) => {
      if (snapshot.exists()) {
        const busesData = snapshot.val();
        const busesArray: Bus[] = Object.keys(busesData).map(key => ({
          id: key,
          ...busesData[key]
        }));
        setBuses(busesArray);
        
        // If no bus is selected, select the first active one
        if (!selectedBus && busesArray.length > 0) {
          const activeBus = busesArray.find(bus => bus.status === 'active');
          if (activeBus) {
            setSelectedBus(activeBus);
          }
        } else if (selectedBus) {
          // Update selected bus data if it's changed
          const updatedBus = busesArray.find(bus => bus.id === selectedBus.id);
          if (updatedBus) {
            setSelectedBus(updatedBus);
          }
        }
      }
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, [selectedBus]);

  // Toggle notifications
  const handleToggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    
    if (newState && selectedStop) {
      // Request notification permission if needed
      if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            toast({
              title: "Notifications Enabled",
              description: `You'll be notified when the bus approaches ${selectedStop.name}.`,
            });
          } else {
            setNotificationsEnabled(false);
            toast({
              variant: "destructive",
              title: "Notification Permission Denied",
              description: "Please enable notifications in your browser settings.",
            });
          }
        });
      } else {
        toast({
          title: "Notifications Enabled",
          description: `You'll be notified when the bus approaches ${selectedStop.name}.`,
        });
      }
    }
  };

  // Handle bus selection change
  const handleBusChange = (busId: string) => {
    const bus = buses.find(b => b.id === busId);
    if (bus) {
      setSelectedBus(bus);
      setSelectedStop(null); // Reset selected stop when changing buses
    }
  };

  // Handle stop selection
  const handleStopSelect = (stop: BusStop) => {
    setSelectedStop(stop);
    
    // If notifications are enabled, show confirmation
    if (notificationsEnabled) {
      toast({
        title: "Stop Selected",
        description: `You'll be notified when the bus approaches ${stop.name}.`,
      });
    }
  };

  // Calculate and update ETAs for stops
  useEffect(() => {
    if (selectedBus && selectedBus.stops && selectedBus.location) {
      // In a real app, you would use a routing service to calculate accurate ETAs
      // Here we'll use a simple distance-based calculation for demo purposes
      const updatedStops = selectedBus.stops.map(stop => {
        const distance = calculateDistance(
          selectedBus.location.lat,
          selectedBus.location.lng,
          stop.location.lat,
          stop.location.lng
        );
        
        // Assuming average bus speed of 30 km/h = 0.5 km/min
        const estimatedTimeMin = Math.round(distance / 0.5);
        
        return {
          ...stop,
          eta: estimatedTimeMin
        };
      });
      
      // Update the selected bus with calculated ETAs
      setSelectedBus({
        ...selectedBus,
        stops: updatedStops
      });
    }
  }, [selectedBus?.location]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Side Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BusIcon className="text-primary h-5 w-5" />
                Bus Tracker
              </CardTitle>
              <CardDescription>
                Select a bus to track its location in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bus-select">Select Bus</Label>
                  <Select 
                    value={selectedBus?.id} 
                    onValueChange={handleBusChange}
                  >
                    <SelectTrigger id="bus-select">
                      <SelectValue placeholder="Select a bus" />
                    </SelectTrigger>
                    <SelectContent>
                      {buses.map((bus) => (
                        <SelectItem key={bus.id} value={bus.id}>
                          {bus.name} ({bus.number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedBus && (
                  <div className="pt-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Status</div>
                      <div className={`text-sm font-semibold ${selectedBus.status === 'active' ? 'text-green-500' : 'text-gray-500'}`}>
                        {selectedBus.status === 'active' ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Driver</div>
                      <div className="text-sm">{selectedBus.driver}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Route</div>
                      <div className="text-sm">{selectedBus.route}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Stops Card */}
          {selectedBus && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="text-primary h-5 w-5" />
                  Bus Stops
                </CardTitle>
                <CardDescription>
                  Select your stop to get arrival notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stop-select">Your Stop</Label>
                    <Select 
                      value={selectedStop?.id ?? ""}
                      onValueChange={(stopId) => {
                        const stop = selectedBus.stops.find(s => s.id === stopId);
                        if (stop) handleStopSelect(stop);
                      }}
                    >
                      <SelectTrigger id="stop-select">
                        <SelectValue placeholder="Select your stop" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedBus.stops.map((stop) => (
                          <SelectItem key={stop.id} value={stop.id}>
                            {stop.name} {stop.eta ? `(${stop.eta} min)` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedStop && (
                    <div className="pt-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          ETA
                        </div>
                        <div className="text-sm font-semibold">
                          {selectedStop.eta || '?'} minutes
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          Notifications
                        </div>
                        <Switch 
                          checked={notificationsEnabled}
                          onCheckedChange={handleToggleNotifications}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Map Container */}
        <div className="lg:col-span-2">
          <Card className="h-[70vh]">
            <CardContent className="p-0">
              <Map 
                busLocation={selectedBus?.location}
                selectedStop={selectedStop || undefined}
                stops={selectedBus?.stops}
                routePoints={routePoints}
                onStopSelect={handleStopSelect}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate distance between two coordinates in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper function to get the route between points
async function fetchBusRoute(busId: string): Promise<RoutePoint[]> {
  // In a real app, you would fetch this from an API or database
  // For demo purposes, we'll create a mock route
  return new Promise((resolve) => {
    // Mock data: create a curvy path
    const baseLat = 20.5937;
    const baseLng = 78.9629;
    const points: RoutePoint[] = [];
    
    // Create 10 points with slight variations for a realistic route
    for (let i = 0; i < 10; i++) {
      points.push({
        lat: baseLat + (Math.random() * 0.05 - 0.025),
        lng: baseLng + (Math.random() * 0.05 - 0.025)
      });
    }
    
    resolve(points);
  });
}
