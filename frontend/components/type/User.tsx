export interface Geolocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}
export type User = {
  userId: string;
  firstName: string;
  lastName: string;
  description: string;
  experience: string;
  createdAt: string;
  email: string;
  role: "customer" | "service_provider";
  location: Geolocation;
  phone?: string;
  address?: string;
};
