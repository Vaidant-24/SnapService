"use client";

import { useState } from "react";
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
  onSubmitted: () => void;
}

export default function ReviewModal({
  bookingId,
  providerId,
  customerId,
  serviceId,
  serviceName,
  onSubmitted,
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

      if (!res.ok) {
        throw new Error("Failed to submit review");
      } else {
        alert("Thank you for your feedback!");
        onSubmitted();
        setOpen(false);
        setRating(0);
        setFeedback("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Rate Service</Button>
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
  );
}
