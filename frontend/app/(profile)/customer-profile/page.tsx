"use client";

import React, { useEffect, useState, useRef } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { User } from "@/components/type/User";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const CustomerProfile = () => {
  const [customer, setCustomer] = useState<User>({} as User);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { user: userData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData && userData.role !== "customer") {
      router.push("/unauthorized");
    }
  }, [userData, router]);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.userId && userData.role === "customer") {
      fetchProfile();
    }
  }, [userData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      let uploadedImageUrl = customer.profileImage;

      if (selectedFile) {
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
      }

      const res = await fetch("http://localhost:3001/user/profile", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, profileImage: uploadedImageUrl }),
      });

      if (!res.ok) throw new Error("Failed to update");

      const updated = await res.json();
      setCustomer(updated);
      setFormData(updated);
      setEditMode(false);
      setMessage("Profile updated successfully!");

      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile.");
    }
  };

  const handleCancel = () => {
    setFormData(customer);
    setEditMode(false);
    setMessage(null);
    setSelectedFile(null);
    setPreviewUrl(null);
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

  if (!userData || userData.role !== "customer" || loading) {
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
            Customer Profile
          </h1>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white text-center px-2 py-2 rounded "
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
        </div>

        {activeTab === "profile" && customer && (
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
                    : customer.profileImage
                    ? `url(${customer.profileImage}) center/cover no-repeat`
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
                {customer.firstName + " " + customer.lastName}
              </h2>
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
                { label: "First Name", name: "firstName", type: "firstName" },
                { label: "Last Name", name: "lastName", type: "lastName" },
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
      </div>
    </AuthGuard>
  );
};

export default CustomerProfile;
