"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaBell } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export const NotificationPopover = () => {
  const {
    user,
    unreadNotifications,
    setUnreadNotifications,
    notificationsCount,
    setNotificationsCount,
  } = useAuth();

  const [popoverOpen, setPopoverOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res1 = await fetch(
        `http://localhost:3001/notifications/user/${user?.userId}/unread`
      );
      const unread = await res1.json();
      setUnreadNotifications(unread);

      const res2 = await fetch(
        `http://localhost:3001/notifications/user/${user?.userId}/unread/count`
      );
      const count = await res2.json();
      setNotificationsCount(count?.length || 0);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      const res = await fetch(
        `http://localhost:3001/notifications/user/${user?.userId}/mark-all-read`,
        {
          method: "PATCH",
        }
      );
      if (!res.ok) {
        throw new Error("Failed to mark all as read from server-side");
      }
      setUnreadNotifications([]); // Clear the notifications
      setNotificationsCount(0); // Reset the badge count
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handlePopoverChange = (open: boolean) => {
    setPopoverOpen(open);
    if (open && user) {
      fetchNotifications();
    }
  };

  const handleNotificationClick = (notifId: string) => {
    console.log("Clicked notification:", notifId);
    setPopoverOpen(false);
  };

  return (
    <Popover open={popoverOpen} onOpenChange={handlePopoverChange}>
      <PopoverTrigger asChild>
        <button className="relative">
          <FaBell className="text-white text-2xl hover:text-orange-500 transition duration-300" />
          {notificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {notificationsCount > 9 ? "9+" : notificationsCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white text-black rounded-lg shadow-lg p-4">
        <h4 className="text-sm font-semibold mb-2">Notifications</h4>
        {unreadNotifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-orange-600 hover:underline mb-2 ml-auto block"
          >
            Mark all as read
          </button>
        )}

        {unreadNotifications.length === 0 ? (
          <p className="text-sm text-gray-500">No new notifications.</p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {unreadNotifications.map((notif) => (
              <li
                key={notif._id}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md cursor-pointer"
                onClick={() => handleNotificationClick(notif._id)}
              >
                {notif.message}
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
};
