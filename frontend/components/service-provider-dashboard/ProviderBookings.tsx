"use client";
import { useEffect, useState, useRef } from "react";
import {
  CalendarDays,
  Filter,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";

interface ProviderBookingsProps {
  providerId: string;
}

interface Booking {
  _id: string;
  customerId: string;
  serviceId: string;
  date: string;
  time: string;
  status: string;
  isPaid: boolean;
  createdAt: string;
  customerName: string;
  serviceName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  updatedAt: string;
  providerDetails: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function ProviderBookings({
  providerId,
}: ProviderBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [dropdownId, setDropdownId] = useState<string | null>(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>(
    {}
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3001/bookings");
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        const filtered = data.filter(
          (b: Booking) => b.providerDetails._id === providerId
        );
        setBookings(filtered);
        setFilteredBookings(filtered);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (providerId) {
      fetchBookings();
    }
  }, [providerId]);

  useEffect(() => {
    let results = [...bookings];

    if (activeFilter !== "all") {
      if (activeFilter === "paid") {
        results = results.filter((b) => b.isPaid);
      } else if (activeFilter === "unpaid") {
        results = results.filter((b) => !b.isPaid);
      } else {
        results = results.filter(
          (b) => b.status.toLowerCase() === activeFilter
        );
      }
    }

    setFilteredBookings(results);
  }, [activeFilter, bookings]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Handle filter dropdown
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(e.target as Node)
      ) {
        setFilterDropdownOpen(false);
      }

      // Handle status update dropdowns
      if (dropdownId) {
        const activeDropdownRef = statusDropdownRefs.current[dropdownId];
        if (
          activeDropdownRef &&
          !activeDropdownRef.contains(e.target as Node)
        ) {
          setDropdownId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownId]);

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:3001/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const updated = await res.json();

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: updated.status } : b))
      );

      setDropdownId(null);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  const filterOptions = [
    "All",
    "Confirmed",
    "Pending",
    "Cancelled",
    "Paid",
    "Unpaid",
  ];

  const displayFilterName =
    activeFilter === "all"
      ? "All"
      : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1);

  return (
    <section className="bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="text-2xl text-orange-500 font-semibold">
            Bookings Dashboard
          </h3>

          <div className="relative" ref={filterDropdownRef}>
            <button
              onClick={() => setFilterDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium"
            >
              <Filter className="h-4 w-4" />
              {displayFilterName}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  filterDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {filterDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 w-48">
                {filterOptions.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setActiveFilter(filter.toLowerCase());
                      setFilterDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      activeFilter === filter.toLowerCase()
                        ? "bg-orange-500 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="relative bg-gray-800 rounded-lg border border-gray-800 shadow-lg transition-all"
              >
                <div className="p-4 border-b border-gray-800 flex justify-between">
                  <div>
                    <h4 className="text-white font-semibold text-lg truncate">
                      {booking.customerName}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {booking.serviceName}
                    </p>
                  </div>
                  <div
                    className={`${getStatusColor(
                      booking.status
                    )} p-3 py-4 rounded-full text-xs text-white font-semibold flex items-center justify-center`}
                  >
                    {booking.status[0].toUpperCase() + booking.status.slice(1)}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <InfoItem
                    icon={<CalendarDays className="text-orange-500 h-5 w-5" />}
                    text={formatDate(booking.date)}
                  />
                  <InfoItem
                    icon={<Clock className="text-orange-500 h-5 w-5" />}
                    text={booking.time}
                  />
                  <InfoItem
                    icon={<Mail className="text-orange-500 h-5 w-5" />}
                    text={booking.customerEmail}
                  />
                  <InfoItem
                    icon={<Phone className="text-orange-500 h-5 w-5" />}
                    text={booking.customerPhone}
                  />
                  <InfoItem
                    icon={<MapPin className="text-orange-500 h-5 w-5" />}
                    text={booking.customerAddress}
                  />
                  <InfoItem
                    icon={<CreditCard className="text-orange-500 h-5 w-5" />}
                    text={
                      booking.isPaid ? (
                        <span className="text-green-400 font-medium">Paid</span>
                      ) : (
                        <span className="text-yellow-400 font-medium">
                          Payment Pending
                        </span>
                      )
                    }
                  />
                </div>

                <div className="p-4 pt-2 bg-gray-950 flex justify-end items-center gap-2 relative z-10">
                  <div
                    className="relative"
                    ref={(el) => {
                      statusDropdownRefs.current[booking._id] = el;
                    }}
                  >
                    <button
                      onClick={() =>
                        setDropdownId((prev) =>
                          prev === booking._id ? null : booking._id
                        )
                      }
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium"
                    >
                      Update Status
                    </button>

                    {dropdownId === booking._id && (
                      <div className="absolute right-0 top-10 bg-gray-800 rounded-md shadow-lg w-48 z-50 border border-gray-700">
                        <button
                          onClick={() =>
                            handleStatusUpdate(booking._id, "confirmed")
                          }
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700 text-left"
                        >
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          Accept Booking
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(booking._id, "cancelled")
                          }
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700 text-left"
                        >
                          <XCircle className="h-4 w-4 text-red-400" />
                          Reject Booking
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <Filter className="mx-auto h-12 w-12 text-gray-600 mb-3" />
            <p className="text-gray-400 text-lg">
              {bookings.length === 0
                ? "No bookings found. New bookings will appear here."
                : "No bookings match the current filter."}
            </p>
            {bookings.length > 0 && activeFilter !== "all" && (
              <button
                onClick={() => setActiveFilter("all")}
                className="mt-4 text-orange-500 hover:text-orange-400 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function InfoItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 text-gray-300">
      {icon}
      <span>{text}</span>
    </div>
  );
}
