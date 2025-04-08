"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Service = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  providerId: { username: string };
};

export default function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:3001/services");
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (error) {
        setError("Unable to load services.");
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookNow = (serviceId: string) => {
    router.push(`/book-service?serviceId=${serviceId}`);
  };

  if (loading) return <p>Loading services...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Featured Services</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.slice(0, 3).map((service) => (
          <div key={service._id} className="bg-gray-900 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold">{service.name}</h3>
            <p className="text-gray-400">{service.description}</p>
            <p className="text-gray-300">Category: {service.category}</p>
            <p className="text-orange-400 font-bold">₹{service.price}</p>
            <p className="text-gray-400">
              Provider: {service.providerId?.username || "N/A"}
            </p>

            <button
              onClick={() => handleBookNow(service._id)}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md w-full"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* Button to navigate to full Services Page */}
      <div className="text-center mt-6">
        <button
          onClick={() => router.push("/services")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md"
        >
          View All Services
        </button>
      </div>
    </div>
  );
}
