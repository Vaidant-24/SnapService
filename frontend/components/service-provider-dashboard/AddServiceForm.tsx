"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { Service } from "../type/Service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Make sure shadcn <Select> is properly imported
import { toast } from "sonner";

type AddServiceFormProps = {
  onServiceAdded: (service: Service) => void;
  onCancel: () => void;
};

type ServiceFormData = {
  name: string;
  description: string;
  price: string;
  category: string;
};

const categories = [
  "Cleaning",
  "Plumbing",
  "Shifting",
  "Carpentry",
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setNewService((prev) => ({ ...prev, category: value }));
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { name, description, price, category } = newService;
    if (!name || !description || !price || !category) {
      setSubmitMessage("Please fill out all fields.");
      return;
    }

    if (!userData?.location) {
      toast.info("Please update your location and try again!");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/services`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...newService,
            price: Number(price),
            providerId: userData?.userId,
            location: userData?.location,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add service");

      const created = await response.json();
      setSubmitMessage("Service added successfully!");
      setNewService({ name: "", description: "", price: "", category: "" });
      onServiceAdded(created);
      onCancel();
    } catch (err) {
      console.error(err);
      setSubmitMessage("Error adding service.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="p-4 sm:p-6 rounded-lg mb-6 bg-gray-900">
      <form onSubmit={handleFormSubmit} className="space-y-4 flex flex-col">
        <input
          type="text"
          name="name"
          placeholder="Service Title"
          value={newService.name}
          onChange={handleInputChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-sm"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newService.description}
          onChange={handleInputChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-sm"
          rows={3}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newService.price}
          onChange={handleInputChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-sm"
        />

        {/* Using shadcn/ui Select */}
        <div>
          <Select
            value={newService.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-full bg-gray-800 border border-gray-700 text-sm">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white">
              {categories.map((cat) => (
                <SelectItem
                  key={cat}
                  value={cat}
                  className="hover:bg-gray-700 focus:bg-gray-700 text-sm"
                >
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <button
            type="submit"
            disabled={submitting}
            className={`${
              submitting ? "bg-green-800" : "bg-green-600 hover:bg-green-700"
            } w-full sm:w-auto px-4 py-2 rounded text-sm`}
          >
            {submitting ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm"
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
