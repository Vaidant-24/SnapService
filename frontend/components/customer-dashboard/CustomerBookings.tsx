"use client";
import { useEffect, useState } from "react";

type Service = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  providerId: { username: string };
};

type Booking = {
  _id: string;
  serviceId: Service;
  date: string;
  status: "Pending" | "Confirmed" | "Cancelled";
};

interface CustomerBookingsProps {
  userId: string;
}

export default function CustomerBookings({ userId }: CustomerBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-gray-800 p-6 rounded-lg shadow"
            >
              <h3 className="text-lg font-bold">{booking.serviceId.name}</h3>
              <p className="text-gray-400">{booking.serviceId.description}</p>
              <p className="text-orange-400 font-bold">
                ₹{booking.serviceId.price}
              </p>
              <p className="text-gray-300">
                Date: {new Date(booking.date).toLocaleDateString()}
              </p>
              <p
                className={`text-sm font-semibold ${
                  booking.status === "Pending"
                    ? "text-yellow-400"
                    : booking.status === "Confirmed"
                    ? "text-green-400"
                    : booking.status === "Cancelled"
                    ? "text-red-400"
                    : "text-blue-400"
                }`}
              >
                Status: {booking.status}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No bookings found.</p>
      )}
    </div>
  );
}
