"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";

interface AddServiceFormProps {
  onServiceAdded: (service: Service) => void;
  onCancel: () => void;
}

interface ServiceFormData {
  name: string;
  description: string;
  price: string;
  category: string;
}

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  providerId: string | { _id: string };
}

const categories = [
  "Cleaning",
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Pest Control",
  "Home Repair",
  "Painting",
  "Appliance Repair",
];

export default function AddServiceForm({
  onServiceAdded,
  onCancel,
}: AddServiceFormProps) {
  const { user: userData } = useAuth();
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [newService, setNewService] = useState<ServiceFormData>({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { name, description, price, category } = newService;
    if (!name || !description || !price || !category) {
      setSubmitMessage("Please fill out all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:3001/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...newService,
          price: Number(price),
          providerId: userData?.userId,
        }),
      });

      if (!response.ok) throw new Error("Failed to add service");

      const created = await response.json();
      setSubmitMessage("✅ Service added successfully!");
      setNewService({ name: "", description: "", price: "", category: "" });
      onServiceAdded(created);
      onCancel();
    } catch (err) {
      console.error(err);
      setSubmitMessage("❌ Error adding service.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-900 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-bold mb-4">Add New Service</h3>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Service Title"
          value={newService.name}
          onChange={handleInputChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newService.description}
          onChange={handleInputChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          rows={3}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newService.price}
          onChange={handleInputChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
        />
        <select
          name="category"
          value={newService.category}
          onChange={handleInputChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
        >
          <option value="" disabled>
            Select Category
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={submitting}
            className={`${
              submitting ? "bg-green-800" : "bg-green-600 hover:bg-green-700"
            } px-4 py-2 rounded`}
          >
            {submitting ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
        {submitMessage && (
          <p className="mt-4 text-sm text-green-400">{submitMessage}</p>
        )}
      </form>
    </section>
  );
}
