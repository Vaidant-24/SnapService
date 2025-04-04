"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";

type UserData = {
  id: number;
  username: string;
  email: string;
  role: "customer";
};

type Service = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  providerId: { username: string };
};

type Booking = {
  _id: string;
  serviceId: Service;
  date: string;
  status: "Pending" | "Confirmed" | "Cancelled";
};

export default function CustomerDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3001/auth/profile", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError("Unable to load user data.");
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:3001/services");
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        setError("Unable to load services.");
      }
    };

    const fetchBookings = async () => {
      if (!userData) return;
      try {
        const response = await fetch(
          `http://localhost:3001/bookings/customer/${userData.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchServices();
    if (userData) fetchBookings();
  }, [userData]);

  const handleBookNow = (serviceId: string) => {
    console.log("---debug---");
    console.log("bookings", bookings);
    router.push(
      `/book-service?serviceId=${serviceId}&customerId=${userData?.id}`
    );
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 bg-black text-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Customer Dashboard</h1>
        </div>

        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : userData ? (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Welcome, {userData.username}
            </h2>
            <p className="text-gray-400 mb-6">
              Explore and book services below:
            </p>

            {/* Available Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.length > 0 ? (
                services.map((service) => (
                  <div
                    key={service._id}
                    className="bg-gray-900 p-6 rounded-lg shadow"
                  >
                    <h3 className="text-lg font-bold">{service.name}</h3>
                    <p className="text-gray-400">{service.description}</p>
                    <p className="text-gray-300">
                      Category: {service.category}
                    </p>
                    <p className="text-orange-400 font-bold">
                      ₹{service.price}
                    </p>
                    <p className="text-gray-400">
                      Provider: {service.providerId?.username || "N/A"}
                    </p>

                    <button
                      onClick={() => handleBookNow(service._id)}
                      className="mt-4 bg-orange-500 hover:bg-orange-700 text-white px-4 py-2 rounded-md w-full"
                    >
                      Book Now
                    </button>
                  </div>
                ))
              ) : (
                <p>No services available.</p>
              )}
            </div>

            {/* Customer's Bookings */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>

              {bookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-gray-800 p-6 rounded-lg shadow"
                    >
                      <h3 className="text-lg font-bold">
                        {booking.serviceId.name}
                      </h3>
                      <p className="text-gray-400">
                        {booking.serviceId.description}
                      </p>
                      <p className="text-orange-400 font-bold">
                        ₹{booking.serviceId.price}
                      </p>
                      <p className="text-gray-300">
                        Date: {new Date(booking.date).toLocaleDateString()}
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          booking.status === "Pending"
                            ? "text-yellow-400"
                            : booking.status === "Confirmed"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        Status: {booking.status}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No bookings found.</p>
              )}
            </div>
          </>
        ) : (
          <p>Unable to load user data.</p>
        )}
      </div>
    </AuthGuard>
  );
}
