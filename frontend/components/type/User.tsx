export type User = {
  userId: string;
  firstName: string;
  lastName: string;
  description: string;
  experience: string;
  createdAt: string;
  email: string;
  role: "customer" | "service_provider";
  phone?: string;
  address?: string;
};
