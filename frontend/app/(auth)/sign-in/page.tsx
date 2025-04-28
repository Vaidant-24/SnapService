"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important for cookies
      });

      const data = await response.json();
      // console.log("--debug--", data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      switch (data.user.role) {
        case "customer":
          setUser(data.user);
          router.push("/customer-dashboard");
          break;
        case "service_provider":
          setUser(data.user);
          router.push("/service-provider-dashboard");
          break;
        default:
          router.push("/unAuthorized");
          break;
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center mt-4 p-4 sm:p-8">
      <div className="w-full max-w-md rounded-lg bg-gray-900 p-8 shadow-md">
        <h1 className="mb-3 text-center text-2xl font-bold text-white">
          Login to Your Account
        </h1>
        {error && (
          <div className="mb-4 rounded-md bg-red-800 bg-opacity-50 p-4 text-red-400">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-400"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-400"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-orange-600 py-2 px-4 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-orange-500 hover:text-orange-400"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
