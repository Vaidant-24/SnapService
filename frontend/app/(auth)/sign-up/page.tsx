"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("customer");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");
    const phone = formData.get("phone");
    const address = formData.get("address");
    const experience = formData.get("experience");
    const description = formData.get("description");

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          phone,
          address,
          role,
          experience: parseInt((experience as string) || "0"),
          description,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      router.push("/sign-in");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 sm:p-8">
      <div className="w-full max-w-lg rounded-lg bg-gray-900 p-6 sm:p-10 shadow-md">
        {" "}
        {/* Responsive Form */}
        <h1 className="mb-6 text-center text-2xl sm:text-3xl font-bold text-white">
          Create an Account
        </h1>
        {error && (
          <div className="mb-4 rounded-md bg-red-800 bg-opacity-50 p-4 text-red-400">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">
              First Name
            </label>
            <input
              name="firstName"
              type="text"
              required
              className="mt-1 block w-full rounded-md bg-gray-800 p-3 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">
              Last Name
            </label>
            <input
              name="lastName"
              type="text"
              required
              className="mt-1 block w-full rounded-md bg-gray-800 p-3 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md bg-gray-800 p-3 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md bg-gray-800 p-3 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">
              Phone
            </label>
            <input
              name="phone"
              type="tel"
              required
              className="mt-1 block w-full rounded-md bg-gray-800 p-3 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">
              Address
            </label>
            <input
              name="address"
              type="text"
              required
              className="mt-1 block w-full rounded-md bg-gray-800 p-3 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">
              Role
            </label>
            <select
              name="role"
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-800 p-3 text-white"
            >
              <option value="customer">Customer</option>
              <option value="service_provider">Service Provider</option>
            </select>
          </div>
          {role === "service_provider" && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">
                  Experience
                </label>
                <input
                  name="experience"
                  type="number"
                  className="mt-1 block w-full rounded-md bg-gray-800 p-3 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">
                  Description
                </label>
                <textarea
                  name="description"
                  className="mt-1 block w-full rounded-md bg-gray-800 p-3 text-white"
                />
              </div>
            </>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-orange-600 p-3 text-white"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
