"use client";

import { useEffect, useState } from "react";

interface ProviderBookingsProps {
  providerId: string;
}

interface Booking {
  _id: string;
  customerId: string;
  serviceId: string;
  date: string;
  status: string;
  isPaid: boolean;
  createdAt: string;
  customerName: string;
  serviceName: string;
  customerEmail: string;
  providerDetails: {
    _id: string;
    username: string;
    email: string;
  };
}

export default function ProviderBookings({
  providerId,
}: ProviderBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!providerId) return;

    const fetchBookings = async () => {
      try {
        const bookingsRes = await fetch("http://localhost:3001/bookings");

        if (!bookingsRes.ok) throw new Error("Failed to fetch bookings");

        const bookingsData = await bookingsRes.json();

        const providerBookings = bookingsData.filter(
          (booking: Booking) => booking.providerDetails._id === providerId
        );

        setBookings(providerBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [providerId]);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <section>
      <div className="container mx-auto px-4 py-8">
        <h3 className="text-2xl text-orange-500 font-semibold mt-6 mb-4">
          Bookings
        </h3>
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-gray-900 p-6 rounded-lg">
                <p className="text-gray-300 font-semibold">
                  Customer: {booking.customerName} ({booking.customerEmail})
                </p>
                <p className="text-gray-300">Service: {booking.serviceName}</p>
                <p className="text-gray-300">
                  Date: {new Date(booking.date).toDateString()}
                </p>
                <p className="text-yellow-300">Status: {booking.status}</p>
                <p className="text-gray-300">
                  Payment: {booking.isPaid ? "Paid" : "Pending"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No bookings yet.</p>
        )}
      </div>
    </section>
  );
}
