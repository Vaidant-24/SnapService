"use client";
import { useEffect, useState } from "react";
import { Filter, Loader, ChevronLeft, ChevronRight } from "lucide-react";
import BookingCard from "./BookingCard";
import BookingsFilter from "./BookingsFilter";
import { Booking } from "../type/Booking";

import BookingDetailModal from "./BookingDetailModal";
import { MdOutlineSync } from "react-icons/md";

interface ProviderBookingsProps {
  providerId: string;
}

export default function ProviderBookings({
  providerId,
}: ProviderBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [paginatedBookings, setPaginatedBookings] = useState<Booking[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const fetchBookings = async () => {
    try {
      setRefreshing(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/provider/${providerId}`
      );
      const data = await res.json();
      setBookings(data);
      setFilteredBookings(data);
      setCurrentPage(1); // Reset to first page when fetching new data
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (providerId) fetchBookings();
  }, [providerId]);

  useEffect(() => {
    let results = [...bookings];
    if (activeFilter !== "All") {
      results =
        activeFilter === "Paid"
          ? results.filter((b) => b.isPaid)
          : activeFilter === "UnPaid"
          ? results.filter((b) => !b.isPaid)
          : results.filter((b) => b.status === activeFilter);
    }
    setFilteredBookings(results);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [activeFilter, bookings]);

  // Calculate paginated bookings whenever filtered bookings or pagination settings change
  useEffect(() => {
    const totalItems = filteredBookings.length;
    const calculatedTotalPages = Math.max(
      1,
      Math.ceil(totalItems / itemsPerPage)
    );
    setTotalPages(calculatedTotalPages);

    // Ensure current page is valid
    const validCurrentPage = Math.min(
      calculatedTotalPages,
      Math.max(1, currentPage)
    );
    if (validCurrentPage !== currentPage) {
      setCurrentPage(validCurrentPage);
      return;
    }

    // Calculate page items
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    setPaginatedBookings(filteredBookings.slice(startIndex, endIndex));
  }, [filteredBookings, currentPage, itemsPerPage]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-orange-500">
        <Loader className="w-9 h-9 animate-spin" />
      </div>
    );
  }

  return (
    <section className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl text-orange-500 font-semibold">
            Manage Bookings
          </h3>
          <div className="flex items-center ml-8 gap-12">
            <button
              onClick={fetchBookings}
              className="flex items-center gap-2 text-green-500 hover:text-green-600"
            >
              {refreshing ? (
                <Loader className="w-9 h-9 animate-spin" />
              ) : (
                <MdOutlineSync className="w-9 h-9" />
              )}
            </button>
            <BookingsFilter
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </div>
        </div>

        {filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                setBookings={setBookings}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center bg-gray-900 rounded-lg p-8">
            <Filter className="mx-auto h-12 w-12 text-gray-600 mb-3" />
            <p className="text-gray-400 text-lg">
              {bookings.length === 0
                ? "No bookings found."
                : "No bookings match the current filter."}
            </p>
            {bookings.length > 0 && activeFilter !== "All" && (
              <button
                onClick={() => setActiveFilter("All")}
                className="mt-4 text-orange-500 hover:text-orange-400 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {filteredBookings.length > 0 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? "text-gray-500"
                  : "text-orange-500 hover:bg-gray-800"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Page numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === pageNum
                        ? "bg-orange-500 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-500"
                  : "text-orange-500 hover:bg-gray-800"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <BookingDetailModal
        dialogOpen={dialogOpen}
        selectedBooking={selectedBooking}
        setDialogOpen={setDialogOpen}
      />
    </section>
  );
}
