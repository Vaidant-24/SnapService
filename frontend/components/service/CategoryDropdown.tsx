// components/services/CategoryDropdown.tsx
"use client";

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
  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center border border-orange-500"
      >
        Category: {selected}
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10 border border-gray-700">
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
