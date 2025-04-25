"use client";

import React, { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";

const ServiceProviderProfile = () => {
  const [provider, setProvider] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:3001/auth/profile", {
          credentials: "include",
        });
        const data = await res.json();
        setProvider(data);
        setFormData(data);
        fetchReviews(data.userId); // Fetch reviews for the provider
      } catch (err) {
        console.error("Failed to fetch provider profile:", err);
      }
    };

    const fetchReviews = async (providerId: string) => {
      try {
        const res = await fetch(
          `http://localhost:3001/review/provider/${providerId}`
        );
        if (!res.ok) throw new Error("Failed to fetch reviews");

        const data = await res.json();

        setReviews(data);

        const avg =
          data.length > 0
            ? data.reduce((acc: number, r: any) => acc + r.rating, 0) /
              data.length
            : null;
        setAvgRating(avg);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchProfile();
  }, []);

  // console.log("provider reviews: ", reviews);

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
      setProvider(updated);
      setEditMode(false);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile.");
    }
  };

  const handleCancel = () => {
    setFormData(provider); // reset to original
    setEditMode(false);
    setMessage(null);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setFormData((prev: any) => ({
          ...prev,
          location: {
            type: "Point",
            coordinates: [longitude, latitude], // GeoJSON format: [lng, lat]
          },
        }));

        alert("Location detected successfully!");
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to detect location.");
      }
    );
  };

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto my-12  p-6 bg-gray-900 text-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Service Provider Profile</h1>
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
            Stats & Reviews
          </button>
        </div>

        {message && (
          <p className="mb-4 text-sm text-center text-green-400">{message}</p>
        )}

        {activeTab === "profile" && provider && (
          <div className="flex gap-6">
            {/* Avatar Card */}
            <div className="bg-gray-800 rounded-lg p-6 w-1/3 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-600 mb-4" />
              <h2 className="text-xl font-semibold">
                {provider.firstName + " " + provider.lastName}
              </h2>
              <p className="text-orange-400">
                {provider.serviceCategory || "Not set"}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Member since {new Date(provider.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Editable Info Card */}
            <div className="bg-gray-800 rounded-lg p-6 w-2/3 space-y-3">
              <h3 className="text-lg font-semibold mb-2">
                Personal Information
              </h3>
              {[
                { label: "First Name", name: "firstName", type: "firstName" },
                { label: "Last Name", name: "lastName", type: "lastName" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone", name: "phone", type: "text" },
                { label: "Address", name: "address", type: "text" },
                {
                  label: "Experience (years)",
                  name: "experience",
                  type: "number",
                },
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

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 ${
                    editMode ? "text-white" : "text-gray-400"
                  }`}
                  disabled={!editMode}
                />
              </div>

              {editMode && (
                <div className="mt-4">
                  <button
                    onClick={handleDetectLocation}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    📍 Detect My Location
                  </button>
                  {formData.location.coordinates && (
                    <p className="mt-2 text-sm text-green-400">
                      Location set to: [Lng: {formData.location?.coordinates[0]}
                      , Lat: {formData.location?.coordinates[1]}]
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="bg-gray-800 p-6 rounded text-gray-400">
            <div>
              <h2 className="text-xl font-bold text-orange-400 mb-4">
                Reviews & Ratings
              </h2>

              {avgRating !== null && (
                <div className="mb-4">
                  <p className="text-lg text-white font-semibold">
                    ⭐ Average Rating:{" "}
                    <span className="text-yellow-400">
                      {avgRating.toFixed(1)}
                    </span>{" "}
                    / 5
                  </p>
                </div>
              )}

              {reviews.length === 0 ? (
                <p>No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-gray-700 rounded p-4 border border-gray-600"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-400 font-bold">
                          ⭐ {review.rating}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="mt-2 text-white">{review.comment}</p>
                        <span className="text-xs text-gray-400">
                          ~ {review.customerId.firstName}{" "}
                          {review.customerId.lastName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default ServiceProviderProfile;
