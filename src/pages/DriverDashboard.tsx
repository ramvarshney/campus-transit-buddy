
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ref, set, onValue } from "firebase/database";
import { database, auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { Map } from "@/components/Map";
import { Bus, RoutePoint, UserLocation } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bus as BusIcon, MapPin, Route as RouteIcon } from "lucide-react";

export default function DriverDashboard() {
  // Authentication states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);

  // Bus information states
  const [busNumber, setBusNumber] = useState("");
  const [busName, setBusName] = useState("");
  const [driverName, setDriverName] = useState("");
  const [routeName, setRouteName] = useState("");

  // Location tracking states
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(null);
  const [watcherId, setWatcherId] = useState<number | null>(null);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);

  const { toast } = useToast();

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // Check if the driver already has a bus assigned
        const driverRef = ref(database, `drivers/${user.uid}`);
        onValue(driverRef, (snapshot) => {
          if (snapshot.exists()) {
            const driverData = snapshot.val();
            if (driverData.busId) {
              // Fetch bus data
              const busRef = ref(database, `buses/${driverData.busId}`);
              onValue(busRef, (busSnapshot) => {
                if (busSnapshot.exists()) {
                  const busData = busSnapshot.val();
                  setBusName(busData.name || "");
                  setBusNumber(busData.number || "");
                  setDriverName(busData.driver || "");
                  setRouteName(busData.route || "");
                }
              });
            }
          }
        });
      } else {
        // Reset states when logged out
        setBusName("");
        setBusNumber("");
        setDriverName("");
        setRouteName("");
        stopTracking();
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login successful",
        description: "You are now logged in as a driver",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
    }
  };

  // Handle logout
  const handleLogout = async () => {
    stopTracking();
    try {
      await signOut(auth);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message,
      });
    }
  };

  // Submit bus information
  const handleSubmitBusInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      // Generate a new bus ID or use an existing one
      const busId = `bus_${user.uid}`;
      
      // Create bus data
      const busData: Partial<Bus> = {
        name: busName,
        number: busNumber,
        driver: driverName,
        route: routeName,
        status: 'inactive',
        stops: [
          { id: 'stop1', name: 'Stop 1', location: { lat: 20.5937, lng: 78.9629 } },
          { id: 'stop2', name: 'Stop 2', location: { lat: 20.6037, lng: 78.9729 } },
          { id: 'stop3', name: 'Stop 3', location: { lat: 20.6137, lng: 78.9829 } },
        ]
      };
      
      // Save to Firebase
      await set(ref(database, `buses/${busId}`), busData);
      
      // Link driver to bus
      await set(ref(database, `drivers/${user.uid}`), {
        busId,
        name: driverName,
      });
      
      toast({
        title: "Bus information saved",
        description: "Your bus details have been updated",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving bus information",
        description: error.message,
      });
    }
  };

  // Start location tracking
  const startTracking = () => {
    if (navigator.geolocation) {
      // Request permission and start tracking
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setCurrentLocation(newLocation);
          
          // Save location to Firebase
          if (user) {
            const busId = `bus_${user.uid}`;
            set(ref(database, `buses/${busId}/location`), {
              lat: latitude,
              lng: longitude,
              timestamp: Date.now(),
            });
            
            // Update status to active
            set(ref(database, `buses/${busId}/status`), 'active');
            
            // Store this point in route history
            setRoutePoints(prev => [...prev, newLocation]);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            variant: "destructive",
            title: "Location error",
            description: `Error getting location: ${error.message}`,
          });
          stopTracking();
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
      
      setWatcherId(watchId);
      setIsTracking(true);
      
      toast({
        title: "Location tracking started",
        description: "Your bus location is now being shared",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation",
      });
    }
  };

  // Stop location tracking
  const stopTracking = () => {
    if (watcherId !== null) {
      navigator.geolocation.clearWatch(watcherId);
      setWatcherId(null);
      setIsTracking(false);
      
      // Update status to inactive in Firebase
      if (user) {
        const busId = `bus_${user.uid}`;
        set(ref(database, `buses/${busId}/status`), 'inactive');
      }
      
      toast({
        title: "Location tracking stopped",
        description: "You are no longer sharing your location",
      });
    }
  };

  // Toggle tracking state
  const toggleTracking = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Driver Controls */}
        <div className="lg:col-span-1 space-y-6">
          {!user ? (
            <Card>
              <CardHeader>
                <CardTitle>Driver Login</CardTitle>
                <CardDescription>
                  Login to access the driver dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full">Login</Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  Contact your administrator if you don't have login credentials
                </p>
              </CardFooter>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Driver Dashboard</CardTitle>
                  <CardDescription>
                    Welcome, {user.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="info">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="info">Bus Info</TabsTrigger>
                      <TabsTrigger value="tracking">Tracking</TabsTrigger>
                    </TabsList>
                    <TabsContent value="info">
                      <form onSubmit={handleSubmitBusInfo} className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="busNumber">Bus Number</Label>
                          <Input 
                            id="busNumber" 
                            value={busNumber} 
                            onChange={(e) => setBusNumber(e.target.value)} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="busName">Bus Name</Label>
                          <Input 
                            id="busName" 
                            value={busName} 
                            onChange={(e) => setBusName(e.target.value)} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="driverName">Driver Name</Label>
                          <Input 
                            id="driverName" 
                            value={driverName} 
                            onChange={(e) => setDriverName(e.target.value)} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="routeName">Route Name</Label>
                          <Input 
                            id="routeName" 
                            value={routeName} 
                            onChange={(e) => setRouteName(e.target.value)} 
                            required 
                          />
                        </div>
                        <Button type="submit" className="w-full">Update Bus Information</Button>
                      </form>
                    </TabsContent>
                    <TabsContent value="tracking" className="pt-4">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="tracking-status">Location Tracking</Label>
                            <Switch 
                              id="tracking-status" 
                              checked={isTracking} 
                              onCheckedChange={toggleTracking} 
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {isTracking 
                              ? "Your location is being shared with students" 
                              : "Toggle to start sharing your location"
                            }
                          </p>
                        </div>
                        
                        {currentLocation && (
                          <div className="pt-2 space-y-2">
                            <p className="text-sm font-medium">Current Coordinates:</p>
                            <p className="text-xs text-muted-foreground">
                              Lat: {currentLocation.lat.toFixed(6)}, Lng: {currentLocation.lng.toFixed(6)}
                            </p>
                          </div>
                        )}
                        
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={handleLogout}
                        >
                          Logout
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              {/* Route Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RouteIcon className="text-primary h-5 w-5" />
                    Route Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium">{routeName || "No route selected"}</p>
                      <p className="text-xs text-muted-foreground">
                        {isTracking ? "Live tracking" : "Tracking inactive"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{busNumber} • {busName}</p>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium mb-2">Stops:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-accent" />
                        <span>Stop 1</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-accent" />
                        <span>Stop 2</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-accent" />
                        <span>Stop 3</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Map Container */}
        <div className="lg:col-span-2">
          <Card className="h-[70vh]">
            <CardContent className="p-0">
              <Map 
                busLocation={currentLocation || undefined}
                routePoints={routePoints}
                stops={[
                  { id: 'stop1', name: 'Stop 1', location: { lat: 20.5937, lng: 78.9629 } },
                  { id: 'stop2', name: 'Stop 2', location: { lat: 20.6037, lng: 78.9729 } },
                  { id: 'stop3', name: 'Stop 3', location: { lat: 20.6137, lng: 78.9829 } },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
