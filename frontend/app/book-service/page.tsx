"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import { Service } from "@/components/type/Service";
import { User } from "@/components/type/User";
import ServiceInfo from "@/components/book-service/ServiceInfo";
import ProviderInfo from "@/components/book-service/ProviderInfo";
import BookingForm, {
  PaymentMethod,
} from "@/components/book-service/BookingForm";

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
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");

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
        setAddress(userData.address || "");
        setPhone(userData.phone || "");
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
          customerPhone: phone,
          customerAddress: address,
          paymentMethod: paymentMethod,
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
              <ServiceInfo service={service} />

              {/* Provider Info */}
              <ProviderInfo service={service} />

              {/* Booking Form */}
              <BookingForm
                date={date}
                time={time}
                address={address}
                phone={phone}
                paymentMethod={paymentMethod}
                setDate={setDate}
                setTime={setTime}
                setAddress={setAddress}
                setPhone={setPhone}
                setPaymentMethod={setPaymentMethod}
                onSubmit={handleBooking}
              />
            </div>
          ) : (
            <p className="text-center text-gray-400">Service not found.</p>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
