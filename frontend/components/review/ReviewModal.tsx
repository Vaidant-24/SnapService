"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ReviewModalProps {
  bookingId: string;
  providerId: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
}

export default function ReviewModal({
  bookingId,
  providerId,
  customerId,
  serviceId,
  serviceName,
}: ReviewModalProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3001/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          providerId,
          customerId,
          serviceId,
          rating,
          comment: feedback,
        }),
      });

      const bookingRes = await fetch(
        `http://localhost:3001/bookings/${bookingId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "Completed",
            isRated: true,
            rating: rating,
            comment: feedback,
          }),
        }
      );

      if (!bookingRes.ok) {
        throw new Error("Failed to update booking status");
      }

      if (!res.ok) {
        throw new Error("Failed to submit review");
      } else {
        alert("Thank you for your feedback!");
        setOpen(false);
        setRating(0);
        setFeedback("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsComplete = async () => {
    try {
      const bookingRes = await fetch(
        `http://localhost:3001/bookings/${bookingId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "Completed",
            isRated: false,
          }),
        }
      );

      if (!bookingRes.ok) {
        throw new Error("Failed to update booking status");
      } else {
        alert("Successfully marked as completed!");
        setOpen(false);
        setRating(0);
        setFeedback("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Button to open the Rate & Review dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 w-40">
            Rate & Review
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md bg-zinc-900 text-white">
          <DialogHeader>
            <DialogTitle>Rate {serviceName}</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <p className="text-sm mb-2">Select a rating</p>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-2xl ${
                    rating >= star ? "text-yellow-400" : "text-gray-600"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <Textarea
              placeholder="Write your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="bg-zinc-800 border border-zinc-700 text-white"
            />

            <Button
              onClick={handleSubmit}
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
            >
              Submit Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Separate button for just marking completion */}
      <Button
        onClick={handleMarkAsComplete}
        className="w-40 bg-green-700 hover:bg-green-800"
      >
        Mark as Completed
      </Button>
    </div>
  );
}
