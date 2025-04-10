"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Booking } from "../type/Booking";

interface UpcomingBookingsProps {
  userId: string;
  limit?: number;
}

export default function CustomerUpcomingBooking({
  userId,
  limit = 5,
}: UpcomingBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/bookings/customer/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();

        // Filter only future bookings and sort by date
        const upcoming = data
          .filter((b: Booking) => new Date(b.date) >= new Date())
          .sort(
            (a: Booking, b: Booking) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .slice(0, limit);

        setBookings(upcoming);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load upcoming bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId, limit]);

  if (loading) return <p>Loading upcoming bookings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">Upcoming Bookings</h2>

      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-gray-800 p-6 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg ">
                  Service:{" "}
                  <span className="text-xl">{booking.serviceId.name}</span>
                </h3>
                <p className="text-lg">
                  Date: {new Date(booking.date).toLocaleDateString()}
                </p>
                <p className="text-lg">
                  Price:{" "}
                  <span className="text-orange-500 ">
                    ₹{booking.serviceId.price}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg">
                  Status:{" "}
                  <span
                    className={`${
                      booking.status === "Pending"
                        ? "text-yellow-500"
                        : booking.status === "Confirmed"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {booking.status}
                  </span>
                </p>
                <p className="text-lg">
                  Payment:{" "}
                  <span
                    className={`${
                      booking.isPaid ? "text-green-500" : "text-yellow-500"
                    }`}
                  >
                    {booking.isPaid ? "Paid" : "Not Paid"}
                  </span>
                </p>
                <p className="text-lg">
                  Payment Method: {booking.paymentMethod}
                </p>
              </div>
            </div>
          ))}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push("/customer-bookings")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md"
            >
              View All Bookings
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">No upcoming bookings found.</p>
      )}
    </div>
  );
}
