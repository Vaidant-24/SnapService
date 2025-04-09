"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";

type Service = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  providerId: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    experience?: string;
  };
};

type User = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "customer" | "service_provider";
  phone?: string;
  address?: string;
};

export default function BookService() {
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loadingService, setLoadingService] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const [userData, setUserData] = useState<User>({} as User);

  const { user: customer, loading: loadingUser } = useAuth();

  // Redirect non-customers
  useEffect(() => {
    if (!loadingUser && customer && customer.role !== "customer") {
      router.push("/unauthorized");
    }
  }, [customer, loadingUser, router]);

  // Fetch service details
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
        setLoadingService(false);
      }
    };
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3001/auth/profile", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unauthorized");

        const userData = await res.json();
        setUserData(userData);
      } catch (error) {
        setError("Error fetching user data:");
      }
    };

    fetchService();
    fetchUser();
  }, [serviceId]);

  const handleBooking = async () => {
    if (!customer) {
      alert("User not loaded yet. Please wait a moment.");
      return;
    }

    if (!date || !time) {
      alert("Please select a date and time for your booking.");
      return;
    }
    // console.log("userData", userData);
    console.log("date", date);

    try {
      const response = await fetch("http://localhost:3001/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customerId: customer.userId,
          serviceId,
          providerDetails: service?.providerId,
          customerName: customer.firstName + " " + customer.lastName,
          customerEmail: customer.email,
          customerPhone: userData.phone,
          customerAddress: userData.address,
          serviceName: service?.name,
          date,
          time,
          status: "Pending",
        }),
      });

      if (!response.ok) throw new Error("Booking failed");

      alert("Booking confirmed!");
      router.push("/customer-dashboard");
    } catch (error) {
      alert("Failed to book service. Please try again.");
    }
  };

  // Combined loading check
  if (loadingUser || loadingService) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-gray-400">Loading details...</p>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white px-4 py-10">
        <div className="max-w-3xl mx-auto bg-gray-900 rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-orange-500 mb-6 text-center">
            Book a Service
          </h1>

          {error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : service ? (
            <div className="space-y-6">
              {/* Service Info */}
              <div>
                <h2 className="text-xl font-semibold text-orange-400 mb-2 border-b border-gray-700 pb-1">
                  Service Information
                </h2>
                <p>
                  <span className="font-semibold">Name:</span> {service.name}
                </p>
                <p>
                  <span className="font-semibold">Description:</span>{" "}
                  {service.description}
                </p>
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {service.category}
                </p>
                <p>
                  <span className="font-semibold text-orange-400">Price:</span>{" "}
                  ₹{service.price}
                </p>
              </div>

              {/* Provider Info */}
              <div>
                <h2 className="text-xl font-semibold text-orange-400 mb-2 border-b border-gray-700 pb-1">
                  Provider Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <p>
                    <span className="text-gray-300">Name:</span>{" "}
                    {service.providerId?.firstName +
                      " " +
                      service.providerId.lastName}
                  </p>
                  <p>
                    <span className="text-gray-300">Phone:</span>{" "}
                    {service.providerId?.phone}
                  </p>
                  <p>
                    <span className="text-gray-300">Email:</span>{" "}
                    {service.providerId?.email}
                  </p>
                  <p>
                    <span className="text-gray-300">Experience:</span>{" "}
                    {service.providerId?.experience ?? "N/A"} yr
                  </p>
                </div>
              </div>

              {/* Booking Form */}
              <div>
                <h2 className="text-xl font-semibold text-orange-400 mb-2 border-b border-gray-700 pb-1">
                  Choose Date & Time
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm text-gray-400">
                      Select Date:
                    </label>
                    <input
                      type="date"
                      className="w-full bg-gray-800 p-2 rounded-md text-white focus:ring-2 focus:ring-orange-500"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-400">
                      Select Time:
                    </label>
                    <input
                      type="time"
                      className="w-full bg-gray-800 p-2 rounded-md text-white focus:ring-2 focus:ring-orange-500"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={handleBooking}
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white py-3 rounded-lg text-lg font-semibold"
              >
                Confirm Booking
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-400">Service not found.</p>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
