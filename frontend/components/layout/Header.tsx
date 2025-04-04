"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="flex items-center justify-between py-4 px-6 md:px-12 bg-transparent">
      {/* Logo and Brand Name */}
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
        {/* Brand Logo using Image Component */}
        <Image
          src="/zap.svg"
          alt="SnapService Logo"
          width={40}
          height={40}
          className="object-contain "
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
        <Link
          href="/services"
          className="text-white hover:text-orange-500 transition duration-300"
        >
          Services
        </Link>
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

      {/* Desktop Action Buttons */}
      <div className="hidden md:flex gap-4">
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
        <div className="absolute top-16 left-0 w-full bg-black text-white flex flex-col gap-4 p-6 md:hidden">
          <Link
            href="/"
            className="hover:text-orange-500 transition duration-300"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            href="/services"
            className="hover:text-orange-500 transition duration-300"
            onClick={toggleMenu}
          >
            Services
          </Link>
          <Link
            href="/about"
            className="hover:text-orange-500 transition duration-300"
            onClick={toggleMenu}
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="hover:text-orange-500 transition duration-300"
            onClick={toggleMenu}
          >
            Contact
          </Link>
          <Link
            href="/sign-in"
            className="hover:text-orange-500 transition duration-300"
            onClick={toggleMenu}
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="hover:text-orange-500 transition duration-300"
            onClick={toggleMenu}
          >
            Register
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
