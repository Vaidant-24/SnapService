"use client";
import { useEffect, useState } from "react";
import { Booking } from "../type/Booking";
import Link from "next/link";
import {
  CalendarDays,
  CircleCheckBig,
  Wallet,
  IndianRupee,
  PackageSearch,
  Loader,
} from "lucide-react";
import { MdOutlineSync } from "react-icons/md";

interface UpcomingBookingsProps {
  userId: string;
}

export default function CustomerUpcomingBooking({
  userId,
}: UpcomingBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(
        `http://localhost:3001/bookings/customer/status/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();

      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to load upcoming bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchBookings();
  }, [userId]);

  if (loading) {
    return (
      <div className="rounded-lg shadow-lg p-12 h-64 flex flex-col items-center justify-center">
        <Loader className="h-10 w-10 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-300">Loading bookings...</p>
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl text-orange-500 font-semibold mb-6">
            Upcoming Bookings
          </h3>
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 text-green-500 hover:text-green-700"
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader className="w-9 h-9 animate-spin" />
            ) : (
              <MdOutlineSync className="w-9 h-9" />
            )}
          </button>
        </div>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-gray-800 rounded-xl p-10 border border-gray-800 shadow-lg"
              >
                <h4 className="text-lg text-white font-semibold flex items-center gap-2 mb-4">
                  {booking.serviceId.name}
                </h4>

                <div className="space-y-3 text-gray-300 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="text-orange-500 w-5 h-5" />
                    <span>
                      Date: {new Date(booking.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <IndianRupee className="text-orange-500 w-5 h-5" />
                    <span>Price: ₹{booking.serviceId.price}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CircleCheckBig className="text-orange-500 w-5 h-5" />
                    <span>
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
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Wallet className="text-orange-500 w-5 h-5" />
                    <span>
                      Payment:{" "}
                      <span
                        className={`${
                          booking.isPaid ? "text-green-500" : "text-yellow-500"
                        }`}
                      >
                        {booking.isPaid ? "Paid" : "Not Paid"}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Wallet className="text-orange-500 w-5 h-5" />
                    <span>Payment Method: {booking.paymentMethod}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="col-span-full mt-6 text-center">
              <Link href="/customer-bookings">
                <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-md">
                  View All
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center shadow-md">
            <PackageSearch className="mx-auto h-12 w-12 text-gray-600 mb-3" />
            <p className="text-gray-400 text-lg">No upcoming bookings found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
