"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Service = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  providerId: {
    username: string;
    email: string;
    phone: string;
    address: string;
    experience?: string;
  };
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:3001/services");
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        setError("Unable to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookNow = (serviceId: string) => {
    if (!user) {
      router.push("/sign-in");
    } else {
      router.push(`/book-service?serviceId=${serviceId}&customerId=${user.id}`);
    }
  };

  return (
    <div className="min-h-screen mx-8 bg-black text-white px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500">
            Available Services
          </h1>
          {user && (
            <button
              onClick={() => router.push("/customer-dashboard")}
              className="mt-4 sm:mt-0 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md transition-all duration-300"
            >
              Back to Dashboard
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading services...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-gray-900 p-6 rounded-xl shadow hover:shadow-orange-500/20 transition-all duration-300"
              >
                <h2 className="text-xl font-semibold text-white mb-2">
                  {service.name}
                </h2>
                <p className="text-gray-400 mb-2">{service.description}</p>
                <p className="text-gray-300 text-sm mb-1">
                  Category: {service.category}
                </p>
                <p className="text-orange-400 font-bold text-lg mb-3">
                  ₹{service.price}
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Provider:{" "}
                  <span className="text-white">
                    {service.providerId?.username || "N/A"}
                  </span>
                </p>
                <button
                  onClick={() => handleBookNow(service._id)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-medium transition-all duration-300"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No services available.</p>
        )}
      </div>
    </div>
  );
}
