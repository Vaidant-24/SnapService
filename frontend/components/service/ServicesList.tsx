"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Service } from "@/components/type/Service";
import ServiceCard from "./ServiceCard";
import CategoryDropdown from "./CategoryDropdown";
import SearchField from "./SearchField";
import SortDropdown from "./SortDropDown";
import { getDistanceFromLatLonInKm } from "@/utility/calculateDistance";
import { Button } from "../ui/button";
import { PackageSearch } from "lucide-react";

export default function ServicesList() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNearbyServices = () => {
    if (userLocation) {
      setUserLocation(null);
      return;
    } else {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setUserLocation({
            lat: coords.latitude,
            lon: coords.longitude,
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert("Unable to retrieve your location");
        }
      );
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3001/services");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data: Service[] = await res.json();
        setServices(data);
        setFilteredServices(data);
        setCategories([...new Set(data.map((s) => s.category))]);

        const initialCategory = searchParams.get("category");
        if (initialCategory) {
          setSelectedCategory(initialCategory);
        }
      } catch (err) {
        setError("Unable to load services.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    let filtered = services;

    // 1. Category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    // 2. Search text
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }

    // 3. Sort by price
    if (sortOption === "price-asc") {
      filtered = filtered.slice().sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      filtered = filtered.slice().sort((a, b) => b.price - a.price);
    }

    // 4. Proximity (if userLocation is set)
    if (userLocation) {
      filtered = filtered.filter((service) => {
        if (!service.location) return false;
        const { coordinates } = service.location;
        const distanceKm = getDistanceFromLatLonInKm(
          userLocation.lat,
          userLocation.lon,
          coordinates[1],
          coordinates[0]
        );
        return distanceKm <= 10;
      });
    }

    setFilteredServices(filtered);
  }, [services, selectedCategory, searchQuery, sortOption, userLocation]);

  const handleBookNow = (serviceId: string) => {
    if (user?.role !== "customer") {
      router.push("/sign-in");
    } else {
      router.push(`/book-service?serviceId=${serviceId}`);
    }
  };

  return (
    <div className="min-h-screen mx-8 my-12  text-white px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500">
            Browse Services
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
          <SearchField value={searchQuery} onChange={setSearchQuery} />

          {categories.length > 0 && (
            <CategoryDropdown
              selected={selectedCategory}
              categories={categories}
              onSelect={setSelectedCategory}
              isOpen={isDropdownOpen}
              toggleOpen={() => setIsDropdownOpen(!isDropdownOpen)}
            />
          )}

          <SortDropdown selected={sortOption} onChange={setSortOption} />

          <Button
            onClick={handleNearbyServices}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            {userLocation ? "Clear Nearby" : "Nearby Services"}
          </Button>
        </div>

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
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center shadow-md">
              <PackageSearch className="mx-auto h-12 w-12 text-gray-600 mb-3" />
              <p className="text-gray-400 text-lg">
                {services.length > 0
                  ? "No matching services found."
                  : "No services available."}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
