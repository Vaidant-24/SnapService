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
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    experience?: string;
  };
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:3001/services");
        if (!response.ok) throw new Error("Failed to fetch services");
        const data: Service[] = await response.json();
        setServices(data);
        setFilteredServices(data);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map((service: Service) => service.category))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        setError("Unable to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(
        (service) => service.category === selectedCategory
      );
      setFilteredServices(filtered);
    }
  }, [selectedCategory, services]);

  const handleBookNow = (serviceId: string) => {
    if (user?.role !== "customer") {
      router.push("/sign-in");
    } else {
      router.push(`/book-service?serviceId=${serviceId}`);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
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

        <div className="mb-6 flex justify-end">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center border border-gray-700"
            >
              Category: {selectedCategory}
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                ></path>
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10 border border-gray-700">
                <ul className="py-1">
                  <li key="all-categories">
                    <button
                      onClick={() => handleCategorySelect("All")}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-700 ${
                        selectedCategory === "All"
                          ? "bg-gray-700 text-white"
                          : "text-gray-300"
                      }`}
                    >
                      All
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        onClick={() => handleCategorySelect(category)}
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-700 ${
                          selectedCategory === category
                            ? "bg-gray-700 text-white"
                            : "text-gray-300"
                        }`}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading services...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-orange-500/20 transition-all duration-300"
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
                    {service.providerId?.firstName +
                      " " +
                      service.providerId.lastName || "N/A"}
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
          <p className="text-center text-gray-400">
            {services.length > 0
              ? `No services available in the "${selectedCategory}" category.`
              : "No services available."}
          </p>
        )}
      </div>
    </div>
  );
}
