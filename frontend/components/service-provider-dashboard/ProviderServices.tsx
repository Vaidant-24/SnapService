"use client";

import {
  Package,
  IndianRupee,
  CircleHelp,
  LetterText,
  BriefcaseBusiness,
  Loader,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Service } from "../type/Service";
import { useEffect, useState } from "react";
import { MdOutlineSync } from "react-icons/md";

interface ProviderServicesProps {
  services: Service[];
  handleFetchService: () => void;
  refreshing: boolean;
}

export default function ProviderServices({
  services,
  handleFetchService,
  refreshing,
}: ProviderServicesProps) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [paginatedServices, setPaginatedServices] = useState<Service[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // Calculate paginated services whenever services or pagination settings change
  useEffect(() => {
    const totalItems = services.length;
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
    setPaginatedServices(services.slice(startIndex, endIndex));
  }, [services, currentPage, itemsPerPage]);

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

  return (
    <section className="py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-3xl text-orange-500 font-semibold mb-6">
            Your Services
          </h3>
          <button
            onClick={() => {
              handleFetchService();
              setCurrentPage(1); // Reset to first page when refreshing
            }}
            disabled={refreshing}
            className="flex items-center gap-2 mx-4 text-green-500 hover:text-green-700"
          >
            {refreshing ? (
              <Loader className="w-9 h-9 animate-spin" />
            ) : (
              <MdOutlineSync className="w-9 h-9" />
            )}
          </button>
        </div>

        {services.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedServices.map((service) => (
                <div
                  key={service._id}
                  className="bg-gray-800 rounded-xl p-10 border border-gray-800 duration-300 shadow-lg"
                >
                  <div className="mb-4">
                    <h4 className="text-lg text-white font-semibold flex items-center gap-2">
                      <BriefcaseBusiness className="text-orange-500 w-5 h-5" />
                      {service.name}
                    </h4>
                  </div>

                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-start gap-2">
                      <LetterText className="text-orange-500 w-5 h-5 mt-1" />
                      <p className="text-sm">
                        Description: {service.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <IndianRupee className="text-orange-500 w-5 h-5" />
                      <span className="text-gray-400 text-sm">
                        Price: {service.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CircleHelp className="text-orange-500 w-5 h-5" />
                      <span className="text-gray-400 text-sm">
                        Category: {service.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {services.length > itemsPerPage && (
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
                      ? "text-gray-500"
                      : "text-orange-500 hover:bg-gray-800"
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center shadow-md">
            <Package className="mx-auto h-12 w-12 text-gray-600 mb-3" />
            <p className="text-gray-400 text-lg">
              You haven't added any services yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
