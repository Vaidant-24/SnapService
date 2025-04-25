import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import socket from "@/lib/socket";

export const useNotificationSocket = () => {
  const { user, notificationsCount, setNotificationsCount } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const userId = user.userId;

    // Connect with query param
    socket.io.opts.query = { userId };
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    // CUSTOMER: Booking marked as completed by provider (awaiting review)
    socket.on("booking-completion-approval", (payload) => {
      toast.success("Booking status updated!", {
        description: "Your booking is now awaiting your approval.",
        duration: 3000,
        action: {
          label: "View",
          onClick: () => router.push("/customer-approval"),
        },
      });
      setNotificationsCount((prev) => prev + 1);
    });

    // CUSTOMER: Booking cancelled by provider
    socket.on("booking-cancelled", () => {
      toast.error("Booking was cancelled by the provider", {
        description: "You may try booking another provider.",
        duration: 3000,
      });
      setNotificationsCount((prev) => prev + 1);
    });

    // CUSTOMER: Booking confirmed
    socket.on("booking-confirmed", () => {
      console.log("Booking confirmed by provider");

      toast.success("Booking confirmed!", {
        description: "Your booking request has been accepted.",
        duration: 3000,
      });
      setNotificationsCount((prev) => prev + 1);
    });

    // PROVIDER: Review added by customer
    socket.on("customer-review-added", () => {
      toast.success("New review received!", {
        description: "You have a new review from a customer.",
        duration: 3000,
        action: {
          label: "View",
          onClick: () => router.push("/service-provider-reviews"),
        },
      });
      setNotificationsCount((prev) => prev + 1);
    });

    // PROVIDER: Booking completed (booking marked as completed by customer)
    socket.on("booking-completed", () => {
      toast.success("Booking marked as completed!", {
        description: "The customer has completed the review.",
        duration: 3000,
      });
      setNotificationsCount((prev) => prev + 1);
    });

    // PROVIDER: Provider Booked (by customer)
    socket.on("provider-booked", () => {
      toast.success("Your service is booked!", {
        description: "The customer has booked your service.",
        duration: 3000,
      });
      setNotificationsCount((prev) => prev + 1);
    });

    return () => {
      socket.off("booking-completion-approval");
      socket.off("booking-cancelled");
      socket.off("booking-confirmed");
      socket.off("customer-review-added");
      socket.off("booking-completed");
      socket.off("provider-booked");
      socket.disconnect();
    };
  }, [user]);
};
