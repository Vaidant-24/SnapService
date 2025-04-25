"use client";

import React from "react";
import {
  CalendarDays,
  IndianRupee,
  ClipboardList,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { Booking } from "../type/Booking";

export type FilteredBookingsProps = {
  filteredBookings: Booking[];
  bookings: Booking[];
  filterStatus: string;
};

const FilteredBookings = ({
  filteredBookings,
  bookings,
  filterStatus,
}: FilteredBookingsProps) => {
  return (
    <section className=" py-4">
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
                    <AlertCircle className="text-orange-500 w-5 h-5 mt-1" />
                    <p className="text-sm">
                      Description: {booking.serviceId.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <IndianRupee className="text-orange-500 w-5 h-5" />
                    <span className="text-gray-400 text-sm">
                      Price: ₹{booking.serviceId.price}
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
                    ) : (
                      <ClipboardList className="text-orange-500 w-5 h-5" />
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
