import React from "react";
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
    <div>
      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-gray-800 p-6 rounded-lg shadow"
            >
              <p className="text-lg ">
                Service:{" "}
                <span className="text-md">{booking.serviceId.name}</span>
              </p>
              <p className="text-lg">
                Description:{" "}
                <span className=" text-md">
                  {booking.serviceId.description}
                </span>
              </p>

              <p className="text-lg">
                Price:{" "}
                <span className="text-orange-400 text-md">
                  ₹{booking.serviceId.price}
                </span>
              </p>
              <p className="text-lg">
                Date: {new Date(booking.date).toLocaleDateString()}
              </p>
              <p className="text-lg">
                Status:{" "}
                <span
                  className={`text-md ${
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
              </p>
              <p className="text-lg">
                Payment:{" "}
                <span
                  className={`text-md ${
                    booking.isPaid ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {booking.isPaid ? "Paid" : "Not Paid"}
                </span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">
          {bookings.length > 0
            ? `No ${filterStatus !== "All" ? filterStatus : ""} bookings found.`
            : "No bookings found."}
        </p>
      )}
    </div>
  );
};

export default FilteredBookings;
