"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Service } from "@/components/type/Service";
import ServiceCard from "./ServiceCard";
import CategoryDropdown from "./CategoryDropdown";
import SearchField from "./SearchField";
import SortDropdown from "./SortDropDown";
import { Button } from "../ui/button";
import { PackageSearch, Loader, MapPin } from "lucide-react";
import { Pagination } from "../ui/Pagination";
import { toast } from "sonner";

interface PaginationData {
  services: Service[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export default function ServicesList() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const [paginationData, setPaginationData] = useState<PaginationData>({
    services: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNearbyServices = () => {
    if (userLocation) {
      setUserLocation(null);
      setCurrentPage(1); // Reset to first page
      fetchServices(null, 1); // Refetch without location
    } else {
      if (!navigator.geolocation) {
        toast.error("Please allow access to Location!");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const newLocation = {
            lat: coords.latitude,
            lon: coords.longitude,
          };
          setUserLocation(newLocation);
          setCurrentPage(1); // Reset to first page
          fetchServices(newLocation, 1); // Fetch with new location
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert("Unable to retrieve your location");
        }
      );
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchServices(userLocation, page);

    // Scroll to top of results
    window.scrollTo({
      top: document.getElementById("results-top")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  // Fetch all services with current filters
  const fetchServices = async (location = userLocation, page = currentPage) => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();

      if (selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }

      if (searchQuery.trim() !== "") {
        params.append("search", searchQuery);
      }

      if (sortOption) {
        // Parse sort option
        const [sortBy, sortOrder] = sortOption.split("-");
        params.append("sortBy", sortBy);
        params.append("sortOrder", sortOrder);
      }

      // Add location if available
      if (location) {
        params.append("lat", location.lat.toString());
        params.append("lng", location.lon.toString());
        params.append("radius", "10"); // 10km radius
      }

      // Add pagination parameters
      params.append("page", page.toString());
      params.append("limit", "9");

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/services${queryString}`
      );

      if (!res.ok) throw new Error("Failed to fetch services");

      const data = await res.json();

      // Handle both response formats (for backward compatibility)
      // If data has a 'services' property, it's using the new pagination format
      if (data.services) {
        setPaginationData({
          services: data.services,
          totalCount: data.totalCount || data.services.length,
          totalPages: data.totalPages || 1,
          currentPage: data.currentPage || 1,
        });

        // Extract unique categories if this is the first load
        if (categories.length <= 1 && data.services.length > 0) {
          const uniqueCategories = [
            ...new Set(data.services.map((s: { category: any }) => s.category)),
          ];
          setCategories([...(uniqueCategories as string[])]);
        }
      } else {
        // Handle old format (array of services)
        setPaginationData({
          services: data,
          totalCount: data.length,
          totalPages: 1,
          currentPage: 1,
        });

        // Extract unique categories if this is the first load

        if (categories.length <= 1 && data.length > 0) {
          const uniqueCategories = [
            ...new Set(data.map((s: { category: any }) => s.category)),
          ];
          setCategories([...(uniqueCategories as string[])]);
        }
      }
    } catch (err) {
      setError("Unable to load services.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories separately (only once)
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/services?limit=100`
      );
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();

      // Extract unique categories and add "All" if not present
      const uniqueCategories = [
        ...new Set(data.services.map((s: Service) => s.category)),
      ];
      setCategories([...(uniqueCategories as string[])]);

      const initialCategory = searchParams.get("category");
      if (initialCategory) {
        setSelectedCategory(initialCategory);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  // Initial load - fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle filter changes
  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
    // Only fetch if we're not in the initial loading state
    if (!loading || paginationData.services.length > 0) {
      fetchServices(userLocation, 1);
    }
  }, [selectedCategory, searchQuery, sortOption]);

  // Initial data fetch
  useEffect(() => {
    fetchServices();
  }, []);

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
                  onClick={() => {
                    setUserLocation(null);
                    setCurrentPage(1);
                    fetchServices(null, 1);
                  }}
                >
                  &times;
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Filter controls - stacks vertically on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <SearchField
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
            }}
          />

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

        {/* Results count and pagination info */}
        <div id="results-top">
          {!loading && !error && (
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4">
              <p className="text-gray-400 text-sm">
                Found {paginationData.totalCount}{" "}
                {paginationData.totalCount === 1 ? "service" : "services"}
              </p>
              {paginationData.totalPages > 1 && (
                <p className="text-gray-400 text-sm mt-1 sm:mt-0">
                  Page {paginationData.currentPage} of{" "}
                  {paginationData.totalPages}
                </p>
              )}
            </div>
          )}
        </div>

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
              onClick={() => fetchServices()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white"
            >
              Try Again
            </Button>
          </div>
        ) : paginationData.services.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {paginationData.services.map((service) => (
                <ServiceCard
                  key={service._id}
                  service={service}
                  onBook={handleBookNow}
                />
              ))}
            </div>

            {/* Pagination component */}
            <Pagination
              currentPage={paginationData.currentPage}
              totalPages={paginationData.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 md:p-8 text-center shadow-md">
            <PackageSearch className="mx-auto h-10 w-10 text-gray-600 mb-3" />
            <p className="text-gray-400 text-base md:text-lg">
              No matching services found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
