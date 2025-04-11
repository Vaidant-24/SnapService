"use client";
import { useRef } from "react";
import {
  CalendarDays,
  Clock,
  Mail,
  Phone,
  MapPin,
  CreditCard,
} from "lucide-react";
import InfoItem from "./InfoItem";
import { Booking } from "../type/Booking";

export default function BookingCard({
  booking,
  setBookings,
}: {
  booking: Booking;
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleStatusUpdate = async (status: string) => {
    try {
      const res = await fetch(`http://localhost:3001/bookings/${booking._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const updated = await res.json();
      console.log("Updated booking:", updated.status);

      setBookings((prev) =>
        prev.map((b) =>
          b._id === booking._id ? { ...b, status: updated.status } : b
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500";
      case "Pending":
        return "bg-yellow-500";
      case "Cancelled":
        return "bg-red-500";
      case "Awaiting Completion":
        return "bg-orange-500";
      case "Completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-800 shadow-lg">
      <div className="p-4 border-b border-gray-800 flex justify-between">
        <div>
          <h4 className="text-white font-semibold text-lg truncate">
            {booking.customerName}
          </h4>
          <p className="text-gray-400 text-sm">{booking.serviceName}</p>
        </div>
        <div
          className={`${getStatusColor(
            booking.status
          )} px-2 py-2 rounded-full text-xs text-white font-semibold  flex items-center justify-center`}
        >
          {booking.status}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <InfoItem
          icon={<CalendarDays className="text-orange-500 h-5 w-5" />}
          text={formatDate(booking.date)}
        />
        <InfoItem
          icon={<Clock className="text-orange-500 h-5 w-5" />}
          text={booking.time}
        />
        <InfoItem
          icon={<Mail className="text-orange-500 h-5 w-5" />}
          text={booking.customerEmail}
        />
        <InfoItem
          icon={<Phone className="text-orange-500 h-5 w-5" />}
          text={booking.customerPhone}
        />
        <InfoItem
          icon={<MapPin className="text-orange-500 h-5 w-5" />}
          text={booking.customerAddress}
        />
        <InfoItem
          icon={<CreditCard className="text-orange-500 h-5 w-5" />}
          text={booking.isPaid ? "Paid" : "Unpaid"}
        />

        {/* Inline Actions */}
        <div
          ref={dropdownRef}
          className="flex gap-3 items-center pt-2 flex-wrap"
        >
          <select
            onChange={(e) => {
              const selected = e.target.value;
              if (selected !== "") handleStatusUpdate(selected);
            }}
            defaultValue=""
            className="px-3 py-2 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-700 transition-colors"
          >
            <option value="" disabled>
              Change Status
            </option>
            <option value="Confirmed">Accept</option>
            <option value="Cancelled">Reject</option>
          </select>

          {booking.status === "Confirmed" && (
            <button
              onClick={() => handleStatusUpdate("Awaiting Completion")}
              className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 transition-colors"
            >
              Request Completion
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
