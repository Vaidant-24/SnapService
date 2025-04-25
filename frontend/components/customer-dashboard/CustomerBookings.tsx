"use client";
import { useEffect, useState } from "react";
import { Booking } from "../type/Booking";
import { ChevronDown, Filter } from "lucide-react";
import DropDown from "./DropDown";
import FilteredBookings from "./FilteredBookings";

export type FilterOption =
  | "All"
  | "Pending"
  | "Confirmed"
  | "Cancelled"
  | "Completed";

interface CustomerBookingsProps {
  userId: string;
}

export default function CustomerBookings({ userId }: CustomerBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterOption>("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/bookings/customer/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        setBookings(data);
        setFilteredBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  useEffect(() => {
    if (filterStatus === "All") {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(
        (booking) => booking.status === filterStatus
      );
      setFilteredBookings(filtered);
    }
  }, [filterStatus, bookings]);

  const handleFilterChange = (option: FilterOption) => {
    setFilterStatus(option);
    setIsDropdownOpen(false);
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-6 mr-4">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-3xl text-orange-500 font-semibold">
          Your Bookings
        </h2>

        <DropDown
          setIsDropdownOpen={setIsDropdownOpen}
          isDropdownOpen={isDropdownOpen}
          filterStatus={filterStatus}
          handleFilterChange={handleFilterChange}
        />
      </div>

      <FilteredBookings
        filteredBookings={filteredBookings}
        bookings={bookings}
        filterStatus={filterStatus}
      />
    </div>
  );
}
