"use client";
import { useRef, useState, useEffect } from "react";
import { ChevronDown, Filter } from "lucide-react";

export default function BookingsFilter({
  activeFilter,
  setActiveFilter,
}: {
  activeFilter: string;
  setActiveFilter: (value: string) => void;
}) {
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const filterOptions = [
    "All",
    "Confirmed",
    "Pending",
    "Cancelled",
    "Paid",
    "UnPaid",
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={filterDropdownRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium"
      >
        <Filter className="h-4 w-4" />
        {activeFilter}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            dropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 w-48">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setDropdownOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                activeFilter === filter
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
