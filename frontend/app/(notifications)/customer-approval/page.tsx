"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  Loader,
  MapPin,
  PackageSearch,
} from "lucide-react";
import { Booking } from "@/components/type/Booking";
import InfoItem from "@/components/service-provider-dashboard/InfoItem";
import ReviewModal from "@/components/review/ReviewModal";
import { useAuth } from "@/context/AuthContext";
import { MdOutlineSync } from "react-icons/md";
import { Toaster, toast } from "sonner";
import AuthGuard from "@/components/auth/AuthGuard";

export default function NotificationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user: customer } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAwaiting = async () => {
    try {
      setRefreshing(true);
      const res = await fetch(
        `http://localhost:3001/bookings/filterByStatus?status=Awaiting Completion&customerId=${customer?.userId}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (customer?.userId) {
      fetchAwaiting();
    }
  }, [customer]);

  const handleBookingComplete = () => {
    fetchAwaiting();
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="rounded-lg shadow-lg my-12 h-64 flex flex-col items-center justify-center">
          <Loader className="h-10 w-10 text-orange-500 animate-spin mb-4" />
          <p className="text-gray-300">Loading Approvals...</p>
          <Toaster position="top-right" richColors />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen container mx-auto mt-24 px-4">
        {/* Toast container */}
        <Toaster position="top-right" richColors />

        <div className="flex justify-between mx-8 px-4 items-center mb-4">
          <h3 className="text-2xl text-orange-500 font-semibold">
            Your Approvals
          </h3>
          <button
            onClick={fetchAwaiting}
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

        {bookings.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg mx-12 p-8 text-center shadow-md">
            <PackageSearch className="mx-auto h-12 w-12 text-gray-600 mb-3" />
            <p className="text-gray-400">No pending completion requests.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold">
                      {booking.serviceName}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Provider: {booking.providerDetails.firstName}{" "}
                      {booking.providerDetails.lastName}
                    </p>
                  </div>
                  <span className="text-md text-yellow-400 font-bold">
                    Awaiting Your Approval
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <InfoItem
                    icon={<CalendarDays className="text-orange-500 h-5 w-5" />}
                    text={new Date(booking.date).toDateString()}
                  />
                  <InfoItem
                    icon={<Clock className="text-orange-500 h-5 w-5" />}
                    text={booking.time}
                  />
                  <InfoItem
                    icon={<MapPin className="text-orange-500 h-5 w-5" />}
                    text={booking.customerAddress}
                  />
                </div>

                <div className="mt-4 flex gap-4 flex-wrap">
                  <ReviewModal
                    bookingId={booking._id}
                    providerId={booking.providerDetails._id}
                    customerId={booking.customerId}
                    serviceId={
                      typeof booking.serviceId === "string"
                        ? booking.serviceId
                        : ""
                    }
                    serviceName={booking.serviceName}
                    onComplete={handleBookingComplete}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
