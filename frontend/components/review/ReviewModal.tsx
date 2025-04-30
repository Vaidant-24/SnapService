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
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface ReviewModalProps {
  bookingId: string;
  providerId: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
  onComplete?: () => void; // New callback prop for refreshing parent
}

export default function ReviewModal({
  bookingId,
  providerId,
  customerId,
  serviceId,
  serviceName,
  onComplete,
}: ReviewModalProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);

      toast.promise(
        async () => {
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

          if (!res.ok) throw new Error("Failed to submit review");

          const bookingRes = await fetch(
            `http://localhost:3001/bookings/${bookingId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: "Completed",
                isRated: true,
                rating: rating,
                comment: feedback,
              }),
            }
          );

          if (!bookingRes.ok)
            throw new Error("Failed to update booking status");

          setOpen(false);
          setRating(0);
          setFeedback("");

          // Call the callback to refresh the parent component
          if (onComplete) onComplete();

          return "Review submitted successfully";
        },
        {
          loading: "Submitting your review...",
          success: "Thank you for your feedback!",
          error: (err) => `Error: ${err.message}`,
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsComplete = async () => {
    try {
      setSubmitting(true);

      toast.promise(
        async () => {
          const bookingRes = await fetch(
            `http://localhost:3001/bookings/${bookingId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "X-User-Role": user?.role || "customer",
              },
              body: JSON.stringify({
                status: "Completed",
                isRated: false,
              }),
            }
          );

          if (!bookingRes.ok)
            throw new Error("Failed to update booking status");

          setOpen(false);

          // Call the callback to refresh the parent component
          if (onComplete) onComplete();

          return "Booking marked as completed";
        },
        {
          loading: "Processing...",
          success: "Successfully marked as completed!",
          error: (err) => `Error: ${err.message}`,
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
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
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        onClick={handleMarkAsComplete}
        className="w-40 bg-green-700 hover:bg-green-800"
        disabled={submitting}
      >
        {submitting ? "Processing..." : "Mark as Completed"}
      </Button>
    </div>
  );
}
