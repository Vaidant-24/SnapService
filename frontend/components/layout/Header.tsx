"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { NotificationPopover } from "../notification/NotificationPopOver";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    user,
    logout,
    notificationsCount,
    unreadNotifications,
    markAllAsRead,
    fetchNotifications,
  } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Socket connection
  useNotificationSocket();

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user, notificationsCount]);

  const dashboardPath =
    user?.role === "customer"
      ? "/customer-dashboard"
      : "/service-provider-dashboard";

  const profilePath =
    user?.role === "customer"
      ? "/customer-profile"
      : "/service-provider-profile";

  return (
    <header className="flex items-center  justify-between  py-4 px-6 md:px-12 bg-gray-950 w-full fixed z-50">
      {/* Logo and Brand Name */}
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
        <Image
          src="/zap.svg"
          alt="SnapService Logo"
          width={40}
          height={40}
          className="object-contain"
        />
        <span>SnapService</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6">
        <Link
          href="/"
          className="text-white hover:text-orange-500 transition duration-300"
        >
          Home
        </Link>
        {user && (
          <Link
            href={dashboardPath}
            className="text-white hover:text-orange-500 transition duration-300"
          >
            Dashboard
          </Link>
        )}

        {user?.role === "customer" && (
          <Link
            href="/customer-bookings"
            onClick={toggleMenu}
            className="hover:text-orange-500 transition duration-300"
          >
            Bookings
          </Link>
        )}

        {user?.role === "service_provider" && (
          <Link
            href="/service-provider-bookings"
            onClick={toggleMenu}
            className="hover:text-orange-500 transition duration-300"
          >
            Bookings
          </Link>
        )}
        {user?.role !== "service_provider" && (
          <Link
            href="/services"
            className="text-white hover:text-orange-500 transition duration-300"
          >
            Services
          </Link>
        )}

        <Link
          href="/about"
          className="text-white hover:text-orange-500 transition duration-300"
        >
          About Us
        </Link>
        <Link
          href="/contact"
          className="text-white hover:text-orange-500 transition duration-300"
        >
          Contact
        </Link>
      </nav>

      {/* Desktop Right Side */}
      <div className="hidden md:flex items-center gap-8 relative">
        {user && (
          <NotificationPopover
            notifications={unreadNotifications}
            count={notificationsCount}
            onMarkAllAsRead={markAllAsRead}
          />
        )}

        {user ? (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 text-white hover:text-orange-500 transition"
            >
              <Image
                src="avatar.svg"
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <ChevronDown size={18} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-gray-950 shadow-lg border border-gray-700">
                <Link
                  href={profilePath}
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile: {user.firstName}
                </Link>
                <Link
                  href={dashboardPath}
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                {user?.role === "customer" && (
                  <Link
                    href="/customer-approval"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Your Approval
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              href="/sign-in"
              className="px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 hover:text-orange-600 transition duration-300"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300"
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Toggle */}

      <button
        className="md:hidden text-orange-500 hover:text-orange-600 transition duration-300"
        onClick={toggleMenu}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-14 right-2 bg-gray-800 border border-gray-700 text-white flex flex-col gap-4 p-6 md:hidden z-50">
          <Link
            href="/"
            onClick={toggleMenu}
            className="hover:text-orange-500 transition duration-300"
          >
            Home
          </Link>
          {user && (
            <Link
              href={dashboardPath}
              onClick={toggleMenu}
              className="hover:text-orange-500 transition duration-300"
            >
              Dashboard
            </Link>
          )}
          {user?.role !== "service_provider" && (
            <Link
              href="/services"
              onClick={toggleMenu}
              className="hover:text-orange-500 transition duration-300"
            >
              Services
            </Link>
          )}

          {user?.role === "customer" && (
            <Link
              href="/customer-bookings"
              onClick={toggleMenu}
              className="hover:text-orange-500 transition duration-300"
            >
              Bookings
            </Link>
          )}

          {user?.role === "service_provider" && (
            <Link
              href="/service-provider-bookings"
              onClick={toggleMenu}
              className="hover:text-orange-500 transition duration-300"
            >
              Bookings
            </Link>
          )}

          {user?.role === "service_provider" && (
            <Link
              href="/service-provider-reviews"
              onClick={toggleMenu}
              className="hover:text-orange-500 transition duration-300"
            >
              Reviews
            </Link>
          )}

          {user?.role === "customer" && (
            <Link
              href="/customer-approval"
              onClick={toggleMenu}
              className="hover:text-orange-500 transition duration-300"
            >
              Approvals
            </Link>
          )}

          <Link
            href="/about"
            onClick={toggleMenu}
            className="hover:text-orange-500 transition duration-300"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            onClick={toggleMenu}
            className="hover:text-orange-500 transition duration-300"
          >
            Contact
          </Link>
          {user ? (
            <button
              onClick={() => {
                logout();
                toggleMenu();
              }}
              className="text-left hover:text-orange-500 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/sign-in"
                onClick={toggleMenu}
                className="hover:text-orange-500 transition duration-300"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                onClick={toggleMenu}
                className="hover:text-orange-500 transition duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
