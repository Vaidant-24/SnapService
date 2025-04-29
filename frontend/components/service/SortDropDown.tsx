"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SortDropdownProps {
  selected: string;
  onChange: (sortBy: string) => void;
}

export default function SortDropdown({
  selected,
  onChange,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  // Format display text
  const displayText = selected
    ? `Sort by: ${selected === "price-asc" ? "Price-Asc" : "Price-Desc"}`
    : "Sort by";

  return (
    <div className="w-full sm:w-64 relative" ref={dropdownRef}>
      {/* Custom trigger button */}
      <button
        onClick={toggleDropdown}
        className="w-full px-2 py-2 bg-gray-800 text-white text-sm border border-gray-600 rounded-md flex items-center justify-between"
        type="button"
      >
        <span className="px-2">{displayText}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {/* Custom dropdown content */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 text-white border border-gray-600 rounded-md shadow-lg overflow-auto">
          <div
            className="px-1 py-2 hover:bg-gray-700 text-sm cursor-pointer"
            onClick={() => handleOptionSelect("price-asc")}
          >
            Price: Low to High
          </div>
          <div
            className="px-1 py-2 hover:bg-gray-700 text-sm cursor-pointer"
            onClick={() => handleOptionSelect("price-desc")}
          >
            Price: High to Low
          </div>
        </div>
      )}
    </div>
  );
}
