
import { Map } from "@/components/Map";
import { useState } from "react";
import { BusStop } from "@/types";

const Index = () => {
  const [busLocation] = useState({
    lat: 20.5937, 
    lng: 78.9629,
    timestamp: Date.now()
  });
  
  const [stops] = useState<BusStop[]>([
    {
      id: "1",
      name: "Central Station",
      location: { lat: 20.5937, lng: 78.9629 },
      eta: 5
    },
    {
      id: "2",
      name: "North Campus",
      location: { lat: 20.5957, lng: 78.9659 },
      eta: 10
    }
  ]);
  
  const [selectedStop, setSelectedStop] = useState<BusStop | undefined>(undefined);
  
  const handleSelectStop = (stop: BusStop) => {
    setSelectedStop(stop);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Bus Tracking Map Demo</h1>
      <div className="h-[500px] w-full border border-gray-200 rounded-lg shadow-lg overflow-hidden">
        <Map
          busLocation={busLocation}
          stops={stops}
          selectedStop={selectedStop}
          onStopSelect={handleSelectStop}
          routePoints={[
            { lat: 20.5937, lng: 78.9629 },
            { lat: 20.5947, lng: 78.9639 },
            { lat: 20.5957, lng: 78.9659 }
          ]}
        />
      </div>
      
      <div className="mt-4 p-4 bg-card rounded-lg shadow">
        <h2 className="text-lg font-bold mb-2">Bus Status</h2>
        <p>Bus is currently {selectedStop ? `headed to ${selectedStop.name}` : "on route"}</p>
        {selectedStop && (
          <p className="mt-2">ETA: {selectedStop.eta} minutes</p>
        )}
      </div>
    </div>
  );
};

export default Index;
