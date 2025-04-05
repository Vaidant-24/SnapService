"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import React, { useEffect, useState } from "react";

const CustomerProfile = () => {
  const [initialData, setInitialData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:3001/auth/profile", {
          credentials: "include",
        });
        const data = await res.json();
        setInitialData({
          username: data.username,
          email: data.email,
          phone: data.phone,
          address: data.address,
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setMessage({ type: "error", text: "Failed to load profile." });
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (formData: FormData) => {
    const updatedData = {
      username: formData.get("username"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
    };
    // console.log("Updated data:", updatedData);

    try {
      const res = await fetch("http://localhost:3001/user/profile", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      // const data = await res.json();
      // console.log("Response data:", data);

      if (!res.ok) throw new Error("Update failed");

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Something went wrong during update.",
      });
    }
  };

  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Customer Profile</h1>

        {message && (
          <p
            className={`mb-4 ${
              message.type === "success" ? "text-green-400" : "text-red-500"
            }`}
          >
            {message.text}
          </p>
        )}

        <form action={handleUpdate} className="space-y-4">
          <div>
            <label className="block mb-1">Username</label>
            <input
              type="text"
              name="username"
              defaultValue={initialData.username}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={initialData.email}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              defaultValue={initialData.phone}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Address</label>
            <input
              type="text"
              name="address"
              defaultValue={initialData.address}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded"
          >
            Update Profile
          </button>
        </form>
      </div>
    </AuthGuard>
  );
};

export default CustomerProfile;
