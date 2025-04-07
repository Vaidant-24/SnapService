"use client";

import React, { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";

const CustomerProfile = () => {
  const [customer, setCustomer] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:3001/auth/profile", {
          credentials: "include",
        });
        const data = await res.json();
        setCustomer(data);
        setFormData(data);
      } catch (err) {
        console.error("Failed to fetch customer profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:3001/user/profile", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update");

      const updated = await res.json();
      setCustomer(updated);
      setEditMode(false);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile.");
    }
  };

  const handleCancel = () => {
    setFormData(customer);
    setEditMode(false);
    setMessage(null);
  };

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Customer Profile</h1>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold"
            >
              Edit Profile
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded ${
              activeTab === "profile"
                ? "bg-gray-800 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 rounded ${
              activeTab === "stats"
                ? "bg-gray-800 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Stats & History
          </button>
        </div>

        {message && (
          <p className="mb-4 text-sm text-center text-green-400">{message}</p>
        )}

        {activeTab === "profile" && customer && (
          <div className="flex gap-6">
            {/* Avatar Card */}
            <div className="bg-gray-800 rounded-lg p-6 w-1/3 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-600 mb-4" />
              <h2 className="text-xl font-semibold">{customer.username}</h2>
              <p className="text-orange-400">Valued Customer</p>
              <p className="text-sm text-gray-400 mt-2">
                Member since {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Info Card */}
            <div className="bg-gray-800 rounded-lg p-6 w-2/3 space-y-3">
              <h3 className="text-lg font-semibold mb-2">
                Personal Information
              </h3>
              {[
                { label: "Username", name: "username", type: "username" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone", name: "phone", type: "text" },
                { label: "Address", name: "address", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block text-sm text-gray-400 mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 ${
                      editMode ? "text-white" : "text-gray-400"
                    }`}
                    disabled={!editMode}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="bg-gray-800 p-6 rounded text-gray-400">
            <p>Booking history, reviews, or usage stats will appear here.</p>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default CustomerProfile;
