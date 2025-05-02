"use client";
import { useEffect, useState } from "react";
import { Booking } from "../type/Booking";
import DropDown from "./DropDown";
import FilteredBookings from "./FilteredBookings";
import { MdOutlineSync } from "react-icons/md";
import { Loader, ChevronLeft, ChevronRight } from "lucide-react";

export type FilterOption =
  | "All"
  | "Pending"
  | "Confirmed"
  | "Cancelled"
  | "Completed";

interface CustomerBookingsProps {
  userId: string;
}

export default function CustomerBookings({ userId }: CustomerBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterOption>("All");
  const [refreshing, setRefreshing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [paginatedBookings, setPaginatedBookings] = useState<Booking[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/customer/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      setBookings(data);
      setFilteredBookings(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchBookings();
  }, [userId]);

  useEffect(() => {
    if (filterStatus === "All") {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(
        (booking) => booking.status === filterStatus
      );
      setFilteredBookings(filtered);
    }
    setCurrentPage(1);
  }, [filterStatus, bookings]);

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

  const handleFilterChange = (option: FilterOption) => {
    setFilterStatus(option);
    setIsDropdownOpen(false);
  };

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
      <div className="rounded-lg shadow-lg p-12 h-64 flex flex-col items-center justify-center">
        <Loader className="h-10 w-10 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-300">Loading bookings...</p>
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-6 mr-4">
      <div className="flex justify-between px-4">
        <h2 className="text-2xl text-orange-500 font-semibold">
          Your Bookings
        </h2>
        <div className="flex justify-between items-center mb-4 ml-8 gap-12">
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 text-green-500 hover:text-green-700"
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader className="w-9 h-9 animate-spin" />
            ) : (
              <MdOutlineSync className="w-9 h-9" />
            )}
          </button>
          <DropDown
            setIsDropdownOpen={setIsDropdownOpen}
            isDropdownOpen={isDropdownOpen}
            filterStatus={filterStatus}
            handleFilterChange={handleFilterChange}
          />
        </div>
      </div>

      <FilteredBookings
        filteredBookings={paginatedBookings}
        bookings={bookings}
        filterStatus={filterStatus}
        setBookings={setBookings}
      />

      {/* Pagination Controls */}
      {filteredBookings.length > 0 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${
              currentPage === 1
                ? "text-gray-500 "
                : "text-orange-500 hover:bg-gray-800"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Page numbers */}
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show at most 5 page buttons
              let pageNum;
              if (totalPages <= 5) {
                // If 5 or fewer total pages, show all
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                // If on pages 1-3, show pages 1-5
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                // If on last 3 pages, show last 5 pages
                pageNum = totalPages - 4 + i;
              } else {
                // Otherwise show 2 pages before and 2 after current
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
                ? "text-gray-500 "
                : "text-orange-500 hover:bg-gray-800"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
