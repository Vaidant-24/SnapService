import { useEffect, useState } from "react";

export type PaymentMethod = "Cash" | "Online";

interface BookingFormProps {
  date: string;
  time: string;
  address: string;
  phone: string;
  paymentMethod: PaymentMethod;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setAddress: (address: string) => void;
  setPhone: (phone: string) => void;
  setPaymentMethod: (mode: PaymentMethod) => void;
  onSubmit: () => void;
}

export default function BookingForm({
  date,
  time,
  address,
  phone,
  paymentMethod,
  setDate,
  setTime,
  setAddress,
  setPhone,
  setPaymentMethod,
  onSubmit,
}: BookingFormProps) {
  const [minDate, setMinDate] = useState("");
  const [minTime, setMinTime] = useState("");

  useEffect(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0]; // Format: yyyy-mm-dd
    const currentTimeStr = now.toTimeString().slice(0, 5); // Format: HH:MM

    setMinDate(todayStr);

    // Only restrict time if selected date is today
    if (date === todayStr) {
      setMinTime(currentTimeStr);
    } else {
      setMinTime(""); // no restriction
    }
  }, [date]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-orange-400 mb-2 border-b border-gray-700 pb-1">
        Booking Details
      </h2>

      {/* Date & Time */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 text-sm text-gray-400">
            Select Date:
          </label>
          <input
            type="date"
            className="w-full bg-gray-800 p-2 rounded-md text-white focus:ring-2 focus:ring-orange-500"
            value={date}
            min={minDate}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-400">
            Select Time:
          </label>
          <input
            type="time"
            className="w-full bg-gray-800 p-2 rounded-md text-white focus:ring-2 focus:ring-orange-500"
            value={time}
            min={minTime}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      {/* Address */}
      <div className="mb-4">
        <label className="block mb-1 text-sm text-gray-400">Address:</label>
        <textarea
          rows={2}
          className="w-full bg-gray-800 p-2 rounded-md text-white focus:ring-2 focus:ring-orange-500"
          placeholder="Enter your address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* Phone */}
      <div className="mb-4">
        <label className="block mb-1 text-sm text-gray-400">
          Phone Number:
        </label>
        <input
          type="tel"
          className="w-full bg-gray-800 p-2 rounded-md text-white focus:ring-2 focus:ring-orange-500"
          placeholder="Enter your contact number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* Payment Mode */}
      <div className="mb-4">
        <label className="block mb-1 text-sm text-gray-400">
          Payment Method:
        </label>
        <select
          className="w-full bg-gray-800 p-2 rounded-md text-white focus:ring-2 focus:ring-orange-500"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
        >
          <option value="">Select Payment Mode</option>
          <option value="Cash">Cash</option>
          <option value="Online">Online</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        onClick={onSubmit}
        className="w-full mt-6 bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white py-3 rounded-lg text-lg font-semibold"
      >
        Confirm Booking
      </button>
    </div>
  );
}
