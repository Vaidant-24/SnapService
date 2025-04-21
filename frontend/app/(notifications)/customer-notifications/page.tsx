"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Booking } from "@/components/type/Booking";
import InfoItem from "@/components/service-provider-dashboard/InfoItem";
import ReviewModal from "@/components/review/ReviewModal";
import { useAuth } from "@/context/AuthContext";

export default function NotificationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user: customer } = useAuth();

  useEffect(() => {
    const fetchAwaiting = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/bookings/filterByStatus?status=Awaiting Completion&customerId=${customer?.userId}`
        );
        const data = await res.json();

        setBookings(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchAwaiting();
  }, [customer]);

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-400">No pending completion requests.</p>
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
                <span className="text-lg text-yellow-400 font-bold">
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
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
