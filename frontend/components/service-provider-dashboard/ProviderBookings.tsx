"use client";
import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import BookingCard from "./BookingCard";
import BookingsFilter from "./BookingsFilter";
import { Booking } from "../type/Booking";

import BookingDetailModal from "./BookingDetailModal";
import { MdOutlineSync } from "react-icons/md";

interface ProviderBookingsProps {
  providerId: string;
}

export default function ProviderBookings({
  providerId,
}: ProviderBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/bookings/provider/${providerId}`
      );
      const data = await res.json();
      setBookings(data);
      setFilteredBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (providerId) fetchBookings();
  }, [providerId]);

  useEffect(() => {
    let results = [...bookings];
    if (activeFilter !== "All") {
      results =
        activeFilter === "Paid"
          ? results.filter((b) => b.isPaid)
          : activeFilter === "UnPaid"
          ? results.filter((b) => !b.isPaid)
          : results.filter((b) => b.status === activeFilter);
    }
    setFilteredBookings(results);
  }, [activeFilter, bookings]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-t-2 border-orange-500 border-b-2 rounded-full" />
      </div>
    );
  }

  return (
    <section className=" min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl text-orange-500 font-semibold">
            Bookings Dashboard
          </h3>
          <div className="flex items-center gap-6 mb-6">
            <button
              onClick={fetchBookings}
              className="flex items-center gap-2 text-green-500 hover:text-green-600"
            >
              <MdOutlineSync className="w-9 h-9" />
            </button>
            <BookingsFilter
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </div>
        </div>

        {filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                setBookings={setBookings}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center bg-gray-900 rounded-lg p-8">
            <Filter className="mx-auto h-12 w-12 text-gray-600 mb-3" />
            <p className="text-gray-400 text-lg">
              {bookings.length === 0
                ? "No bookings found."
                : "No bookings match the current filter."}
            </p>
            {bookings.length > 0 && activeFilter !== "All" && (
              <button
                onClick={() => setActiveFilter("All")}
                className="mt-4 text-orange-500 hover:text-orange-400 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      <BookingDetailModal
        dialogOpen={dialogOpen}
        selectedBooking={selectedBooking}
        setDialogOpen={setDialogOpen}
      />
    </section>
  );
}
