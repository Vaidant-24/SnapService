"use client";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { Booking } from "../type/Booking";

interface UpcomingBookingsProps {
  providerId: string;
}

export default function ProviderUpcomingBookings({
  providerId,
}: UpcomingBookingsProps) {
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (!providerId) return;

    const fetchUpcomingBookings = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3001/bookings/provider/status/${providerId}`
        );
        if (!res.ok) throw new Error("Failed to fetch bookings");

        const data = await res.json();

        // Filter bookings by provider and only get confirmed/pending bookings
        const providerBookings = data;

        // Get today's date (without time)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter upcoming bookings (today or later)
        const upcoming = providerBookings.filter((b: Booking) => {
          const bookingDate = new Date(b.date);
          return bookingDate >= today;
        });

        // Sort by nearest date
        const sorted = upcoming.sort((a: Booking, b: Booking) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        // Take top 5
        setUpcomingBookings(sorted.slice(0, 5));
      } catch (err) {
        console.error("Error fetching upcoming bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingBookings();
  }, [providerId]);

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <div className="rounded-lg shadow-lg p-4 h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-lg py-4 my-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-3xl text-orange-500 font-semibold">
          Upcoming Bookings
        </h3>
      </div>

      {upcomingBookings.length > 0 ? (
        <div className="space-y-3 py-1">
          {upcomingBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-gray-800 rounded-md px-4 py-4 border border-gray-800"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-medium py-1">
                    {booking.customerName}
                  </p>
                  <p className="text-gray-400 text-sm">{booking.serviceName}</p>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs ${
                    booking.status === "Confirmed"
                      ? "bg-green-500 text-white"
                      : booking.status === "Cancelled"
                      ? "bg-red-500 text-white"
                      : booking.status === "Completed"
                      ? "bg-blue-500 text-white"
                      : "bg-yellow-500 text-white"
                  }`}
                >
                  {booking.status}
                </div>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                <div className="flex items-center gap-1 text-gray-300">
                  <CalendarDays className="h-4 w-4 text-orange-500" />
                  <span>{formatDate(booking.date)}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <CreditCard className="h-4 w-4 text-orange-500" />
                  <span>{booking.isPaid ? "Paid" : "Unpaid"}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push("/service-provider-bookings")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-md"
            >
              View All
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">No upcoming bookings found.</p>
        </div>
      )}
    </div>
  );
}
