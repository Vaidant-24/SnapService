export interface Geolocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}
export type User = {
  serviceCategory: string;
  userId: string;
  firstName: string;
  lastName: string;
  description: string;
  experience: string;
  createdAt: string;
  email: string;
  role: "customer" | "service_provider";
  location?: Geolocation;
  profileImage?: string;
  phone?: string;
  address?: string;
};
