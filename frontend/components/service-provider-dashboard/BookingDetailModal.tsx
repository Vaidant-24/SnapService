import React from "react";
import { Booking } from "../type/Booking";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type BookingDetailProps = {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBooking: Booking | null;
};

const BookingDetailModal = ({
  dialogOpen,
  setDialogOpen,
  selectedBooking,
}: BookingDetailProps) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="bg-gray-800 text-white border border-gray-700">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription className="text-gray-400">
            Full info about this service booking
          </DialogDescription>
        </DialogHeader>

        {selectedBooking && (
          <div className="space-y-3 mt-4">
            <p>
              <strong>Customer:</strong> {selectedBooking.customerName}
            </p>
            <p>
              <strong>Service:</strong> {selectedBooking.serviceName}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedBooking.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {selectedBooking.time}
            </p>
            <p>
              <strong>Email:</strong> {selectedBooking.customerEmail}
            </p>
            <p>
              <strong>Phone:</strong> {selectedBooking.customerPhone}
            </p>
            <p>
              <strong>Address:</strong> {selectedBooking.customerAddress}
            </p>
            <p>
              <strong>Paid:</strong> {selectedBooking.isPaid ? "Yes" : "No"}
            </p>
            <p>
              <strong>Payment Method:</strong> {selectedBooking.paymentMethod}
            </p>
            <p>
              <strong>Status:</strong> {selectedBooking.status}
            </p>
            <p>
              <strong>Rating:</strong> {selectedBooking.rating}/5
            </p>
            <p>
              <strong>Comment:</strong>{" "}
              {selectedBooking.comment || "No comment"}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailModal;
