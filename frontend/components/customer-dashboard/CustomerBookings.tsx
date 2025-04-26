"use client";
import { useEffect, useState } from "react";
import { Booking } from "../type/Booking";
import DropDown from "./DropDown";
import FilteredBookings from "./FilteredBookings";
import { MdOutlineSync } from "react-icons/md";

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

  useEffect(() => {
    if (!userId) return;

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

  if (loading) {
    return (
      <div className="rounded-lg shadow-lg p-4 h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-6 mr-4">
      <div className="flex justify-between  mb-4 px-4">
        <h2 className="text-3xl text-orange-500 font-semibold">
          Your Bookings
        </h2>
        <div className="flex justify-between items-center mb-4 gap-12">
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 text-green-500 hover:text-green-700"
          >
            <MdOutlineSync className="w-9 h-9" />
          </button>
          <DropDown
            setIsDropdownOpen={setIsDropdownOpen}
            isDropdownOpen={isDropdownOpen}
            filterStatus={filterStatus}
            handleFilterChange={handleFilterChange}
          />
        </div>
      </div>

      <FilteredBookings
        filteredBookings={filteredBookings}
        bookings={bookings}
        filterStatus={filterStatus}
        setBookings={setBookings}
      />
    </div>
  );
}
