"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";

type UserData = {
  id: string;
  username: string;
  email: string;
};

type Booking = {
  _id: string;
  customerId: string;
  serviceId: string;
  date: string;
  status: string;
  isPaid: boolean;
  createdAt: string;
  providerId: { _id: string; username: string; email: string };
};

export default function ServiceProviderDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
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
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userData) return; // Prevent fetching until userData is available

    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:3001/bookings");
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();

        // Filter bookings for the logged-in service provider
        const providerBookings = data.filter(
          (booking: Booking) => booking.providerId._id === userData.id
        );
        setBookings(providerBookings);
      } catch (error) {
        console.error("Error fetching bookings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userData]); // Runs only when userData is available

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 bg-black text-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Service Provider Dashboard</h1>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Welcome, {userData?.username}
            </h2>
            <h3 className="text-lg font-semibold mt-6 mb-4">Bookings</h3>
            {bookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-gray-900 p-6 rounded-lg">
                    <p className="text-gray-300">
                      Customer ID: {booking.customerId}
                    </p>
                    <p className="text-gray-300">
                      Service ID: {booking.serviceId}
                    </p>
                    <p className="text-gray-300">
                      Date: {new Date(booking.date).toDateString()}
                    </p>
                    <p className="text-gray-300">Status: {booking.status}</p>
                    <p className="text-gray-300">
                      Payment: {booking.isPaid ? "Paid" : "Pending"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No bookings yet.</p>
            )}
          </>
        )}
      </div>
    </AuthGuard>
  );
}
