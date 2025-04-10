"use client";
import { useEffect, useState } from "react";
import { Booking } from "../type/Booking";

type FilterOption = "All" | "Pending" | "Confirmed" | "Cancelled";

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
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Bookings</h2>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            Filter: {filterStatus}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              ></path>
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
              <ul className="py-1">
                {["All", "Pending", "Confirmed", "Cancelled"].map((option) => (
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
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-gray-800 p-6 rounded-lg shadow"
            >
              <p className="text-lg ">
                Service:{" "}
                <span className="text-md">{booking.serviceId.name}</span>
              </p>
              <p className="text-lg">
                Description:{" "}
                <span className=" text-md">
                  {booking.serviceId.description}
                </span>
              </p>

              <p className="text-lg">
                Price:{" "}
                <span className="text-orange-400 text-md">
                  ₹{booking.serviceId.price}
                </span>
              </p>
              <p className="text-lg">
                Date: {new Date(booking.date).toLocaleDateString()}
              </p>
              <p className="text-lg">
                Status:{" "}
                <span
                  className={`text-md ${
                    booking.status === "Pending"
                      ? "text-yellow-400"
                      : booking.status === "Confirmed"
                      ? "text-green-400"
                      : booking.status === "Cancelled"
                      ? "text-red-400"
                      : "text-blue-400"
                  }`}
                >
                  {booking.status}
                </span>
              </p>
              <p className="text-lg">
                Payment:{" "}
                <span
                  className={`text-md ${
                    booking.isPaid ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {booking.isPaid ? "Paid" : "Not Paid"}
                </span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">
          {bookings.length > 0
            ? `No ${filterStatus !== "All" ? filterStatus : ""} bookings found.`
            : "No bookings found."}
        </p>
      )}
    </div>
  );
}
