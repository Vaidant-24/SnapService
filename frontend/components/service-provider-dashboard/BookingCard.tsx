"use client";

import { useRef } from "react";
import { CalendarDays, Clock, Mail, Phone, MapPin } from "lucide-react";
import InfoItem from "./InfoItem";
import { Booking } from "../type/Booking";

export default function BookingCard({
  booking,
  setBookings,
  onViewDetails,
}: {
  booking: Booking;
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  onViewDetails: (booking: Booking) => void;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Define valid status transitions
  const validTransitions: { [key: string]: string[] } = {
    Pending: ["Confirmed", "Cancelled"],
    Confirmed: ["Awaiting Completion"],
    AwaitingCompletion: [],
    Completed: [],
    Cancelled: [],
  };

  // Handle status update with validation
  const handleStatusUpdate = async (newStatus: string) => {
    const currentStatusKey = booking.status.replace(/\s/g, ""); // remove spaces for matching
    const allowedNextStatuses = validTransitions[currentStatusKey];

    if (!allowedNextStatuses.includes(newStatus)) {
      console.error(
        `Invalid status transition from ${booking.status} to ${newStatus}`
      );
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/bookings/${booking._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const updated = await res.json();

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
      <div className="p-4 border-b border-gray-800 flex justify-between items-start">
        <div>
          <h4 className="text-white font-semibold text-lg truncate">
            {booking.customerName}
          </h4>
          <p className="text-gray-400 text-sm">{booking.serviceName}</p>
        </div>
        <div className="shrink-0">
          <span
            className={`${getStatusColor(
              booking.status
            )} px-3 py-1 rounded text-xs text-white font-medium inline-block`}
          >
            {booking.status}
          </span>
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

        {/* Inline Actions */}
        {booking.status !== "Completed" && booking.status !== "Cancelled" && (
          <div
            ref={dropdownRef}
            className="flex gap-3 items-center pt-2 flex-wrap"
          >
            {/* Dropdown showing only valid next statuses */}
            {validTransitions[booking.status.replace(/\s/g, "")]?.length >
              0 && (
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
                {validTransitions[booking.status.replace(/\s/g, "")]?.map(
                  (nextStatus) => (
                    <option key={nextStatus} value={nextStatus}>
                      {nextStatus === "Confirmed" ? "Accept" : nextStatus}
                    </option>
                  )
                )}
              </select>
            )}

            {/* Special button for "Request Completion" */}
            {booking.status === "Confirmed" && (
              <button
                onClick={() => handleStatusUpdate("Awaiting Completion")}
                className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 transition-colors"
              >
                Request Completion
              </button>
            )}
          </div>
        )}

        {/* Completed booking: only View Details */}
        {booking.status === "Completed" && (
          <div className="flex gap-3 items-center pt-2 flex-wrap">
            <button
              onClick={() => onViewDetails(booking)}
              className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-600 transition-colors"
            >
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
