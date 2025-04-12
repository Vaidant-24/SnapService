"use client";

interface SortDropdownProps {
  selected: string;
  onChange: (sortBy: string) => void;
}

export default function SortDropdown({
  selected,
  onChange,
}: SortDropdownProps) {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="px-2 py-2 bg-gray-800 text-white border border-gray-600 rounded-md"
    >
      <option value="">Sort by</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  );
}
