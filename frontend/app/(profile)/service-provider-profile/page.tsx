"use client";

import React, { useEffect, useState, useRef } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { User } from "@/components/type/User";
import { Loader, PencilIcon } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const ServiceProviderProfile = () => {
  const [provider, setProvider] = useState<User>({} as User);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [uploading, setUploading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { user: userData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData && userData.role !== "service_provider") {
      router.push("/unauthorized");
    }
  }, [userData, router]);

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
      } finally {
        setLoading(false);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      let uploadedImageUrl = provider.profileImage;

      if (selectedFile) {
        setUploading(true);
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);

        const uploadRes = await fetch(
          "http://localhost:3001/user/upload-profile-pic",
          {
            method: "POST",
            credentials: "include",
            body: uploadData,
          }
        );

        if (!uploadRes.ok) throw new Error("Failed to upload image");

        const result = await uploadRes.json();
        uploadedImageUrl = result.profileImage;
        setUploading(false);
      }

      const res = await fetch("http://localhost:3001/user/profile", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, profileImage: uploadedImageUrl }),
      });

      if (!res.ok) throw new Error("Failed to update");

      const updated = await res.json();
      setProvider(updated);
      setFormData(updated);
      setEditMode(false);
      toast.success("Profile updated successfully!");
      setMessage("Profile updated successfully!");

      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile.");
      setMessage("Error updating profile.");
    }
  };

  const handleCancel = () => {
    setFormData(provider);
    setEditMode(false);
    setMessage(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.info("Geolocation is not supported by your browser.");
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

        toast.success("Location set successfully!");
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.info("Failed to detect location.");
      }
    );
  };

  const handleProfileImageClick = () => {
    if (editMode && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // For local preview
  };

  if (!userData || userData.role !== "service_provider" || loading) {
    return (
      <AuthGuard>
        <div className="rounded-lg shadow-lg my-12 h-64 flex flex-col items-center justify-center">
          <Loader className="h-10 w-10 text-orange-500 animate-spin mb-4" />
          <p className="text-gray-300">Loading Profile...</p>
          <Toaster position="top-right" richColors />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto my-28 mb-18 p-6 bg-gray-900 text-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-orange-500">
            Service Provider Profile
          </h1>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white text-center px-2 py-2 rounded"
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
              <div
                onClick={handleProfileImageClick}
                className={`w-24 h-24 mx-auto rounded-full mb-4 overflow-hidden relative ${
                  editMode ? "cursor-pointer hover:opacity-80" : ""
                }`}
                style={{
                  background: previewUrl
                    ? `url(${previewUrl}) center/cover no-repeat`
                    : provider.profileImage
                    ? `url(${provider.profileImage}) center/cover no-repeat`
                    : "url('avatar.svg') center/cover no-repeat",
                }}
              >
                {editMode && (
                  <>
                    {/* Overlay Label */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm">
                        {uploading ? "Uploading..." : "Change Photo"}
                      </span>
                    </div>

                    {/* Pencil Icon badge on profile picture */}
                    <div className="absolute -top-0 -right-0 bg-orange-500 p-1 rounded-full border-2 border-gray-800">
                      <PencilIcon className="text-orange w-5 h-5" />
                    </div>
                  </>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

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
                    📍 Set My Location
                  </button>
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
                  {reviews.map(
                    ({ _id, rating, createdAt, comment, customerId }) => (
                      <div
                        key={_id}
                        className="bg-gray-700 rounded-xl p-5 border border-gray-600 shadow-md"
                      >
                        {/* Top Row: Rating and Date */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-200 ">
                            Rating: {rating}/5
                          </span>
                          <span className="text-gray-400 text-sm">
                            {new Date(createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Comment */}
                        <p className="text-white text-base leading-relaxed mb-3">
                          {comment}
                        </p>

                        {/* Customer Name */}
                        <div className="text-right">
                          <span className="text-sm text-gray-400 italic">
                            ~ {customerId.firstName} {customerId.lastName}
                          </span>
                        </div>
                      </div>
                    )
                  )}
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
