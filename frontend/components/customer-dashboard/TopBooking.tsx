"use client";
import { useRouter } from "next/navigation";
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

interface TopBookingsProps {
  userId: string;
  limit?: number;
}

export default function CustomerTopBooking({
  userId,
  limit = 5,
}: TopBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    const fetchTopBookings = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/bookings/customer/${userId}?limit=${limit}`
        );
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching top bookings:", error);
        setError("Failed to load top bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchTopBookings();
  }, [userId, limit]);

  if (loading) return <p>Loading top bookings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">Your Top Bookings</h2>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold">{booking.serviceId.name}</h3>
                <p className="text-gray-300">
                  {new Date(booking.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-orange-400 font-bold">
                  ₹{booking.serviceId.price}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    booking.status === "Pending"
                      ? "text-yellow-400"
                      : booking.status === "Confirmed"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {booking.status}
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
        <p className="text-gray-400">No bookings found.</p>
      )}
    </div>
  );
}
