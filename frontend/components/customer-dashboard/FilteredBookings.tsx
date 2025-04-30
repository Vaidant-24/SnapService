"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  CalendarDays,
  IndianRupee,
  ClipboardList,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  Contact2Icon,
  CheckSquare,
  User2,
  PhoneIcon,
} from "lucide-react";
import { Booking } from "../type/Booking";
import { useAuth } from "@/context/AuthContext";

export type FilteredBookingsProps = {
  filteredBookings: Booking[];
  bookings: Booking[];
  filterStatus: string;
  setBookings: Dispatch<SetStateAction<Booking[]>>;
};

const FilteredBookings = ({
  filteredBookings,
  bookings,
  filterStatus,
  setBookings,
}: FilteredBookingsProps) => {
  const { user } = useAuth();
  const handleCancel = async (bookingId: string) => {
    try {
      // Include user role in the request to handle notifications appropriately
      const res = await fetch(`http://localhost:3001/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": user?.role || "customer", // Pass user role in header
        },
        body: JSON.stringify({
          status: "Cancelled",
          updatedBy: user?.role || "customer", // Also include in body for backend processing
        }),
      });

      if (!res.ok) {
        throw new Error("Error while updating booking status!");
      }

      const updated = await res.json();

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: updated.status } : b
        )
      );
    } catch (error) {
      console.log("Error while updating booking status: ", error);
    }
  };

  const handleMarkComplete = async (bookingId: string) => {
    try {
      // Include user role in the request to handle notifications appropriately
      const res = await fetch(`http://localhost:3001/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": user?.role || "customer", // Pass user role in header
        },
        body: JSON.stringify({
          status: "Completed",
          updatedBy: user?.role || "customer", // Also include in body for backend processing
        }),
      });

      if (!res.ok) {
        throw new Error("Error while updating booking status!");
      }

      const updated = await res.json();

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: updated.status } : b
        )
      );
    } catch (error) {
      console.log("Error while marking booking as completed: ", error);
    }
  };

  return (
    <section className="py-4">
      <div className="container mx-auto px-4 my-4">
        {filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-gray-800 rounded-xl p-10 border border-gray-800 duration-300 shadow-lg"
              >
                <div className="mb-4">
                  <h4 className="text-lg text-white font-semibold flex items-center gap-2">
                    {booking.serviceName}
                  </h4>
                </div>

                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start gap-2">
                    <User2 className="text-orange-500 w-5 h-5 " />
                    <span className="text-gray-400 text-sm">
                      Provider:{" "}
                      {booking.providerDetails.firstName +
                        " " +
                        booking.providerDetails.lastName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <PhoneIcon className="text-orange-500 w-5 h-5" />
                    <span className="text-gray-400 text-sm">
                      Contact: {booking.providerDetails.phone}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-orange-500 w-5 h-5 " />
                    <span className="text-gray-400 text-sm">
                      Description: {booking.serviceId?.description}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <IndianRupee className="text-orange-500 w-5 h-5" />
                    <span className="text-gray-400 text-sm">
                      Price: ₹{booking.serviceId?.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays className="text-orange-500 w-5 h-5" />
                    <span className="text-gray-400 text-sm">
                      Date: {new Date(booking.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {booking.status === "Pending" ? (
                      <AlertCircle className="text-orange-500 w-5 h-5" />
                    ) : booking.status === "Confirmed" ? (
                      <CheckCircle2 className="text-orange-500 w-5 h-5" />
                    ) : booking.status === "Cancelled" ? (
                      <XCircle className="text-orange-500 w-5 h-5" />
                    ) : booking.status === "Awaiting Completion" ? (
                      <ClipboardList className="text-orange-500 w-5 h-5" />
                    ) : (
                      <CheckSquare className="text-orange-500 w-5 h-5" />
                    )}
                    <div className="text-sm text-gray-400">Status: </div>
                    <span
                      className={`text-sm ${
                        booking.status === "Pending"
                          ? "text-yellow-400"
                          : booking.status === "Confirmed"
                          ? "text-green-400"
                          : booking.status === "Cancelled"
                          ? "text-red-400"
                          : booking.status === "Awaiting Completion"
                          ? "text-orange-400"
                          : "text-blue-400"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CreditCard className={`w-5 h-5 text-orange-500`} />
                    <div className="text-sm text-gray-400">Payment: </div>

                    <span
                      className={`text-sm ${
                        booking.isPaid ? "text-green-400" : "text-yellow-400"
                      }`}
                    >
                      {booking.isPaid ? "Paid" : "Not Paid"}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                {(booking.status === "Confirmed" ||
                  booking.status === "Pending" ||
                  booking.status === "Awaiting Completion") && (
                  <div className="mt-4 pt-2 border-t border-gray-700">
                    {/* Cancel button for Pending or Confirmed bookings */}
                    {(booking.status === "Confirmed" ||
                      booking.status === "Pending") && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="w-full py-2 bg-red-500 hover:bg-red-600 rounded-md text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel Booking
                      </button>
                    )}

                    {/* Mark as Complete button for Awaiting Completion bookings */}
                    {booking.status === "Awaiting Completion" && (
                      <button
                        onClick={() => handleMarkComplete(booking._id)}
                        className="w-full py-2 bg-green-500 hover:bg-green-600 rounded-md text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckSquare className="w-4 h-4" />
                        Mark as Completed
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center shadow-md">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-600 mb-3" />
            <p className="text-gray-400 text-lg">
              {bookings.length > 0
                ? `No ${
                    filterStatus !== "All" ? filterStatus : ""
                  } bookings found.`
                : "You haven't booked any services yet."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FilteredBookings;
