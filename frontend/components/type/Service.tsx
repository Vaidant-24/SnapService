import { Geolocation } from "./User";

export type Service = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  providerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    experience?: string;
  };
  averageRating: number;
  reviewCount: number;
  location: Geolocation;
};
