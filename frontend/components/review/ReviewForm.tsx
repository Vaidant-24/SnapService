import { useState } from "react";

interface ReviewFormProps {
  bookingId: string;
  providerId: string;
  customerId: string;
  onSubmitSuccess: () => void;
}

export default function ReviewForm({
  bookingId,
  providerId,
  customerId,
  onSubmitSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:3001/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        rating,
        comment,
        providerId,
        bookingId,
        customerId,
      }),
    });

    if (res.ok) {
      alert("Thank you for your feedback!");
      onSubmitSuccess();
    } else {
      alert("Failed to submit review");
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="text-lg font-bold text-orange-500">Rate Your Service</h3>
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n} Star{n > 1 && "s"}
          </option>
        ))}
      </select>
      <textarea
        className="w-full bg-gray-700 mt-2 p-2 rounded text-white"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your experience..."
      />
      <button
        className="bg-orange-500 mt-3 py-2 px-4 rounded"
        onClick={handleSubmit}
      >
        Submit Review
      </button>
    </div>
  );
}
