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
  providerDetails: { _id: string; username: string; email: string };
};

export default function ServiceProviderDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const router = useRouter();

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

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
    if (!userData) return;

    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:3001/bookings");
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();

        const providerBookings = data.filter(
          (booking: Booking) => booking.providerDetails._id === userData.id
        );
        setBookings(providerBookings);
      } catch (error) {
        console.error("Error fetching bookings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userData]);

  const handleAddService = async () => {
    if (!userData) return;
    // console.log("Adding service with data:", newService);
    // console.log("User ID:", userData.id);

    try {
      const response = await fetch("http://localhost:3001/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...newService,
          price: Number(newService.price),
          providerId: userData.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to add service");
      const result = await response.json();

      setSubmitMessage("Service added successfully!");
      setShowAddForm(false);
      setNewService({
        name: "",
        description: "",
        price: "",
        category: "",
      });

      // Optionally refresh bookings or services list here
    } catch (error) {
      console.error("Add service error:", error);
      setSubmitMessage("Something went wrong while adding the service.");
    }
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 bg-black text-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Service Provider Dashboard</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold"
          >
            + Add New Service
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Welcome, {userData?.username}
            </h2>

            {showAddForm && (
              <div className="bg-gray-900 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-bold mb-4">Add New Service</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Service Title"
                    value={newService.name}
                    onChange={(e) =>
                      setNewService({ ...newService, name: e.target.value })
                    }
                    className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
                  />
                  <textarea
                    placeholder="Description"
                    value={newService.description}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
                    rows={3}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newService.price}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        price: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newService.category}
                    onChange={(e) =>
                      setNewService({ ...newService, category: e.target.value })
                    }
                    className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
                  />

                  <div className="flex space-x-4">
                    <button
                      onClick={handleAddService}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                {submitMessage && (
                  <p className="mt-4 text-sm text-green-400">{submitMessage}</p>
                )}
              </div>
            )}

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
