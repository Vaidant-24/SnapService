import { ChevronDown, Filter } from "lucide-react";
import React from "react";
import { FilterOption } from "./CustomerBookings";

export type DropDownProps = {
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDropdownOpen: boolean;
  filterStatus: FilterOption;
  handleFilterChange: (option: FilterOption) => void;
};

const DropDown = ({
  setIsDropdownOpen,
  isDropdownOpen,
  filterStatus,
  handleFilterChange,
}: DropDownProps) => {
  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-1 py-1 rounded-md font-medium"
      >
        <Filter className="h-4 w-4" />
        {filterStatus}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
          <ul className="py-1">
            {["All", "Pending", "Confirmed", "Cancelled", "Completed"].map(
              (option) => (
                <li key={option}>
                  <button
                    onClick={() => handleFilterChange(option as FilterOption)}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-700 ${
                      filterStatus === option
                        ? "bg-gray-700 text-white"
                        : "text-gray-300"
                    }`}
                  >
                    {option}
                  </button>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropDown;
