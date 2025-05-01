// SearchField.tsx
import React, { useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchField: React.FC<SearchFieldProps> = ({ value, onChange }) => {
  // Create debounced version of the onChange function
  const debouncedOnChange = useMemo(() => debounce(onChange, 400), [onChange]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  return (
    <div className="relative w-full max-w-md">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <Input
        type="text"
        placeholder="Search services..."
        className="pl-10 pr-4 py-2 w-full"
        defaultValue={value}
        onChange={(e) => debouncedOnChange(e.target.value)}
      />
    </div>
  );
};

export default SearchField;
