
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Bus, Clock, MapPin, Route } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <section className="py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Campus Transit <span className="text-primary">Buddy</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track your campus bus in real-time, get ETA updates, and never miss a ride again.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/student">
              <Button size="lg" className="gap-2">
                <Bus className="h-5 w-5" />
                Track My Bus
              </Button>
            </Link>
            <Link to="/driver">
              <Button size="lg" variant="outline" className="gap-2">
                <Route className="h-5 w-5" />
                Driver Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Use Campus Transit Buddy?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card>
            <CardHeader>
              <Bus className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Live Bus Tracking</CardTitle>
              <CardDescription>
                See exactly where your bus is in real-time with our interactive map.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Our system uses OpenStreetMap and Leaflet.js to provide accurate location data without delays. 
                Watch as your bus moves along its route in real-time.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Accurate ETA Updates</CardTitle>
              <CardDescription>
                Know exactly when your bus will arrive at your stop.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Our system calculates the estimated time of arrival based on the bus's current position, 
                speed, and route conditions, giving you the most accurate ETAs possible.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card>
            <CardHeader>
              <Bell className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Proximity Alerts</CardTitle>
              <CardDescription>
                Get notified when your bus is approaching your stop.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Never miss your bus again! Receive automatic notifications when the bus is within 500 meters of your selected stop, 
                giving you plenty of time to get ready.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-muted rounded-lg my-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Select Your Bus</h3>
              <p className="text-muted-foreground">
                Choose from available campus buses on your route.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Pick Your Stop</h3>
              <p className="text-muted-foreground">
                Select your destination stop from the map or dropdown.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Get Notified</h3>
              <p className="text-muted-foreground">
                Receive alerts when your bus is approaching your stop.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/student">
              <Button size="lg">Start Tracking Now</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
