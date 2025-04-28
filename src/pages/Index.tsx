
import { Map } from "@/components/Map";

const Index = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Bus Tracking Map Demo</h1>
      <div className="h-[500px]">
        <Map />
      </div>
    </div>
  );
};

export default Index;
