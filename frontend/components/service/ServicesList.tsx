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
import { PackageSearch, Loader, MapPin } from "lucide-react";

export default function ServicesList() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
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
        setLoading(true);
        const res = await fetch("http://localhost:3001/services");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data: Service[] = await res.json();
        setServices(data);
        setFilteredServices(data);

        // Extract unique categories and add "All" if not present
        const uniqueCategories = [...new Set(data.map((s) => s.category))];
        setCategories(uniqueCategories);

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
    <div className="min-h-screen px-4 sm:px-6 md:px-8 py-8 md:py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header with active filters */}
        <div className="flex flex-col mb-6 mt-12">
          <h1 className="text-2xl md:text-3xl font-semibold text-orange-500 mb-2">
            Explore Services
          </h1>

          {/* Active filters display */}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCategory !== "All" && (
              <span className="bg-gray-800 text-xs md:text-sm px-2 py-1 rounded-full flex items-center">
                {selectedCategory}
                <button
                  className="ml-2 text-gray-400 hover:text-white"
                  onClick={() => setSelectedCategory("All")}
                >
                  &times;
                </button>
              </span>
            )}
            {userLocation && (
              <span className="bg-blue-900 text-xs md:text-sm px-2 py-1 rounded-full flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                Nearby (10km)
                <button
                  className="ml-2 text-gray-400 hover:text-white"
                  onClick={() => setUserLocation(null)}
                >
                  &times;
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Filter controls - stacks vertically on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <SearchField value={searchQuery} onChange={setSearchQuery} />

          <CategoryDropdown
            selected={selectedCategory}
            categories={categories}
            onSelect={setSelectedCategory}
            isOpen={isDropdownOpen}
            toggleOpen={() => setIsDropdownOpen(!isDropdownOpen)}
          />

          <SortDropdown selected={sortOption} onChange={setSortOption} />

          <Button
            onClick={handleNearbyServices}
            className={`${
              userLocation ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
            } text-white rounded-md flex items-center justify-center`}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {userLocation ? "Clear Nearby" : "Show Nearby"}
          </Button>
        </div>

        {/* Results count */}
        {!loading && !error && (
          <p className="text-gray-400 text-sm mb-4">
            Found {filteredServices.length}{" "}
            {filteredServices.length === 1 ? "service" : "services"}
          </p>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-12">
            <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-gray-400">Loading services...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-900 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white"
            >
              Try Again
            </Button>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onBook={handleBookNow}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 md:p-8 text-center shadow-md">
            <PackageSearch className="mx-auto h-10 w-10 text-gray-600 mb-3" />
            <p className="text-gray-400 text-base md:text-lg">
              {services.length > 0
                ? "No matching services found. Try adjusting your filters."
                : "No services available at this time."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
