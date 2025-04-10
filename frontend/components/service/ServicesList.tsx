// components/services/ServicesList.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Service } from "@/components/type/Service";
import ServiceCard from "./ServiceCard";
import CategoryDropdown from "./CategoryDropdown";

export default function ServicesList() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3001/services");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data: Service[] = await res.json();
        setServices(data);
        setFilteredServices(data);
        setCategories([...new Set(data.map((s) => s.category))]);
      } catch (err) {
        setError("Unable to load services.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredServices(services);
    } else {
      setFilteredServices(
        services.filter((s) => s.category === selectedCategory)
      );
    }
  }, [selectedCategory, services]);

  const handleBookNow = (serviceId: string) => {
    if (user?.role !== "customer") {
      router.push("/sign-in");
    } else {
      router.push(`/book-service?serviceId=${serviceId}`);
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

        {categories.length > 0 && (
          <div className="mb-6 flex justify-end">
            <CategoryDropdown
              selected={selectedCategory}
              categories={categories}
              onSelect={setSelectedCategory}
              isOpen={isDropdownOpen}
              toggleOpen={() => setIsDropdownOpen(!isDropdownOpen)}
            />
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-400">Loading services...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onBook={handleBookNow}
              />
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
