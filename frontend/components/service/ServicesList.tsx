"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Service } from "@/components/type/Service";
import ServiceCard from "./ServiceCard";
import CategoryDropdown from "./CategoryDropdown";
import SearchField from "./SearchField";
import SortDropdown from "./SortDropDown";

export default function ServicesList() {
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

    if (selectedCategory !== "All") {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      );
    }

    if (sortOption === "price-asc") {
      filtered = [...filtered].sort((a, b) => a.price - b.price); // a-b asc
    } else if (sortOption === "price-desc") {
      filtered = [...filtered].sort((a, b) => b.price - a.price); // b-a desc
    }

    setFilteredServices(filtered);
  }, [selectedCategory, searchQuery, services, sortOption]);

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
          <p className="text-center text-gray-400">
            {services.length > 0
              ? "No matching services found."
              : "No services available."}
          </p>
        )}
      </div>
    </div>
  );
}
