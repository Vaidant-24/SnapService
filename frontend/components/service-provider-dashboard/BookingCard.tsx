"use client";

import { useRef, useState } from "react";
import { CalendarDays, Clock, Mail, Phone, MapPin } from "lucide-react";
import InfoItem from "./InfoItem";
import { Booking } from "../type/Booking";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [selectValue, setSelectValue] = useState<string>("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const validTransitions: { [key: string]: string[] } = {
    Pending: ["Confirmed", "Cancelled"],
    Confirmed: ["Awaiting Completion", "Cancelled"],
    AwaitingCompletion: [],
    Completed: [],
    Cancelled: [],
  };

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === "Cancelled") {
      // For "Cancelled", we'll show a confirmation dialog
      setPendingStatus("Cancelled");
      setShowCancelDialog(true);
    } else {
      // For other statuses, proceed directly
      handleStatusUpdate(newStatus);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    const currentStatusKey = booking.status.replace(/\s/g, "");
    const allowedNextStatuses = validTransitions[currentStatusKey];

    if (!allowedNextStatuses.includes(newStatus)) {
      console.error(
        `Invalid status transition from ${booking.status} to ${newStatus}`
      );
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${booking._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }

      const updatedBooking = await res.json();
      console.log("Updated booking received:", updatedBooking);

      // Update with the entire booking object returned from the server
      setBookings((prev) =>
        prev.map((b) => (b._id === booking._id ? updatedBooking : b))
      );

      // Reset select value after successful update
      setSelectValue("");
      setPendingStatus(null);
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
    <>
      <div className="bg-gray-800 rounded-lg border border-gray-800 shadow-lg">
        <div className="p-6 border-b border-gray-800 flex justify-between items-start">
          <div>
            <h4 className="text-white font-semibold text-lg truncate">
              {booking.customerName}
            </h4>
            <p className="text-gray-400 text-sm">{booking.serviceName}</p>
          </div>
          <div>
            <div
              className={`${getStatusColor(
                booking.status
              )} px-1 py-1 rounded text-xs text-white font-medium`}
            >
              {booking.status === "Awaiting Completion"
                ? "Awaiting"
                : booking.status}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-2">
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
              {/* Use shadcn Select with controlled value */}
              {validTransitions[booking.status.replace(/\s/g, "")]?.length >
                0 && (
                <Select
                  value={selectValue}
                  onValueChange={(selected) => {
                    if (selected !== "") {
                      handleStatusChange(selected);
                      setSelectValue(selected);
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px] bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white">
                    {validTransitions[booking.status.replace(/\s/g, "")]?.map(
                      (nextStatus) => (
                        <SelectItem
                          key={nextStatus}
                          value={nextStatus}
                          className="hover:bg-gray-600"
                        >
                          {nextStatus === "Confirmed" ? "Accept" : nextStatus}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
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

      {/* Confirmation Dialog for Cancellation */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-gray-800 text-white border border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to cancel this booking for{" "}
              {booking.customerName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSelectValue("");
                setPendingStatus(null);
              }}
              className="bg-gray-700 hover:bg-gray-600"
            >
              No, keep booking
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingStatus) {
                  handleStatusUpdate(pendingStatus);
                }
                setShowCancelDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, cancel booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
