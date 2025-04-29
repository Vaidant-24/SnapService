"use client";

import { useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CategoryDropdownProps {
  selected: string;
  categories: string[];
  onSelect: (category: string) => void;
  isOpen: boolean;
  toggleOpen: () => void;
}

export default function CategoryDropdown({
  selected,
  categories,
  onSelect,
  isOpen,
  toggleOpen,
}: CategoryDropdownProps) {
  // Use ref for clicking outside detection
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (isOpen) toggleOpen();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggleOpen]);

  return (
    <div className="relative w-full sm:w-64" ref={dropdownRef}>
      <button
        onClick={toggleOpen}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white px-2 py-2 rounded-md flex items-center justify-between border border-orange-500"
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="truncate text-sm">Category: {selected}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 ml-2 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1 w-full bg-gray-800 rounded-md shadow-lg z-50 border border-gray-700 max-h-64 overflow-y-auto"
          role="menu"
        >
          <ul className="py-1">
            <li key="all">
              <button
                onClick={() => {
                  onSelect("All");
                  toggleOpen();
                }}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-700 ${
                  selected === "All"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300"
                }`}
                role="menuitem"
              >
                All
              </button>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => {
                    onSelect(category);
                    toggleOpen();
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-700 ${
                    selected === category
                      ? "bg-gray-700 text-white"
                      : "text-gray-300"
                  }`}
                  role="menuitem"
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
