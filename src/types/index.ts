
export interface Bus {
  id: string;
  name: string;
  number: string;
  driver: string;
  route: string;
  status: 'active' | 'inactive';
  location: {
    lat: number;
    lng: number;
    timestamp: number;
  };
  stops: BusStop[];
}

export interface BusStop {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  arrivalTime?: string;
  departureTime?: string;
  eta?: number;
}

export interface UserLocation {
  lat: number;
  lng: number;
}

export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface NotificationSettings {
  enabled: boolean;
  distance: number;
  method: 'push' | 'email' | 'sms';
  contactInfo?: string;
}
