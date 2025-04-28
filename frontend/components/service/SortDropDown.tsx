"use client";

import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

interface SortDropdownProps {
  selected: string;
  onChange: (sortBy: string) => void;
}

export default function SortDropdown({
  selected,
  onChange,
}: SortDropdownProps) {
  return (
    <div className="w-full sm:w-64">
      <Select value={selected} onValueChange={onChange}>
        <SelectTrigger className="w-full px-1 py-1 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500">
          <span>
            {`Sort by: ${
              selected === "price-asc" ? "Price-Asc" : "Price-Desc"
            }` || "Sort by"}
          </span>
        </SelectTrigger>
        <SelectContent className="bg-gray-800 text-white border border-gray-600 rounded-md mt-1">
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
