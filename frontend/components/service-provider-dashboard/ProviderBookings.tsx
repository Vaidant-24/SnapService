"use client";
import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import BookingCard from "./BookingCard";
import BookingsFilter from "./BookingsFilter";
import { Booking } from "../type/Booking";

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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:3001/bookings");
        const data = await res.json();
        const filtered = data.filter(
          (b: Booking) => b.providerDetails._id === providerId
        );
        setBookings(filtered);
        setFilteredBookings(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
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
    <section className="bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl text-orange-500 font-semibold">
            Bookings Dashboard
          </h3>
          <BookingsFilter
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>

        {filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                setBookings={setBookings}
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
    </section>
  );
}
