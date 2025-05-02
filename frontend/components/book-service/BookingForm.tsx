import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // shadcn's helper to combine classes

import { format } from "date-fns";

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
  const [minDate, setMinDate] = useState<Date | undefined>(undefined);
  const [minTime, setMinTime] = useState("");

  useEffect(() => {
    const now = new Date();
    setMinDate(now);

    const todayStr = now.toISOString().split("T")[0];

    if (date === todayStr) {
      const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);
      const timeStr = threeHoursLater.toTimeString().slice(0, 5); // "HH:MM"
      setMinTime(timeStr);
    } else {
      setMinTime(""); // No restriction if not today
    }
  }, [date]);

  useEffect(() => {
    if (minTime && time < minTime) {
      setTime(minTime);
    }
  }, [minTime, time, setTime]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-orange-400 mb-2 border-b border-gray-700 pb-1">
        Booking Details
      </h2>

      {/* Date & Time */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {/* Date Picker */}
        <div>
          <label className="block mb-1 text-sm text-gray-400">
            Select Date:
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-gray-800 text-white",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? format(new Date(date), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto bg-gray-800 text-white p-0">
              <Calendar
                mode="single"
                selected={date ? new Date(date) : undefined}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    setDate(format(selectedDate, "yyyy-MM-dd"));
                  }
                }}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0); // 🛠 set today's time to 00:00:00
                  return date < today;
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Picker */}
        <div>
          <label className="block mb-1 text-sm text-gray-400">
            Select Time:
          </label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger className="w-full bg-gray-800 text-white">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white max-h-60 overflow-y-auto">
              {generateTimeOptions(minTime).map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

      {/* Payment Method */}
      <div className="mb-4">
        <label className="block mb-1 text-sm text-gray-400">
          Payment Method:
        </label>
        <Select
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
        >
          <SelectTrigger className="w-full bg-gray-800 text-white">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white">
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="Online">Online</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <button
        onClick={onSubmit}
        className="w-full mt-6 bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white py-1 rounded-lg text-lg font-semibold"
      >
        Confirm Booking
      </button>
    </div>
  );
}

// Helper to generate 15-min interval time options
function generateTimeOptions(minTime: string) {
  const times: string[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  for (let i = 0; i < 96; i++) {
    // 96 intervals in 24 hours (every 15 min)
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    const timeStr = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    if (!minTime || timeStr >= minTime) {
      times.push(timeStr);
    }
  }
  return times;
}
