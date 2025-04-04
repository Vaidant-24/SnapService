"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Service = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  providerId: { username: string };
};

export default function BookService() {
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const customerId = searchParams.get("customerId");

  useEffect(() => {
    const fetchService = async () => {
      try {
        if (!serviceId) return;

        const response = await fetch(
          `http://localhost:3001/services/${serviceId}`
        );
        if (!response.ok) throw new Error("Failed to fetch service details");

        const data = await response.json();
        setService(data);
      } catch (error) {
        setError("Service not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleBooking = async () => {
    if (!date || !time) {
      alert("Please select a date and time for your booking.");
      return;
    }

    // console.log("---debug---");
    // console.log("serviceId", serviceId);
    // console.log("customerId", customerId);

    try {
      const response = await fetch("http://localhost:3001/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          serviceId,
          customerId,
          providerId: service?.providerId,
          date,
          time,
          status: "Pending",
        }),
      });
      if (!response.ok) throw new Error("Booking failed");

      alert("Booking confirmed!");
      router.push("/customer-dashboard"); // Redirect to Customer Dashboard
    } catch (error) {
      alert("Failed to book service. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Book Service</h1>

      {loading ? (
        <p>Loading service details...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : service ? (
        <div className="bg-gray-900 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">{service.name}</h2>
          <p className="text-gray-400">{service.description}</p>
          <p className="text-gray-300">Category: {service.category}</p>
          <p className="text-orange-400 font-bold">₹{service.price}</p>
          <p className="text-gray-400">
            Provider: {service.providerId?.username}
          </p>

          <div className="mt-4">
            <label className="block text-gray-400">Select Date:</label>
            <input
              type="date"
              className="w-full p-2 mt-1 bg-gray-800 text-white rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-400">Select Time:</label>
            <input
              type="time"
              className="w-full p-2 mt-1 bg-gray-800 text-white rounded"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <button
            onClick={handleBooking}
            className="mt-4 bg-orange-500 hover:bg-orange-700 text-white px-4 py-2 rounded-md w-full"
          >
            Confirm Booking
          </button>
        </div>
      ) : (
        <p>Service not found.</p>
      )}
    </div>
  );
}
