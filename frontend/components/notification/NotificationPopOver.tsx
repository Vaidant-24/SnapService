import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FaBell } from "react-icons/fa";
import { Notification } from "../type/Notification";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export const NotificationPopover = ({
  notifications,
  count,
  onMarkAllAsRead,
}: {
  notifications: Notification[];
  count: number;
  onMarkAllAsRead: () => Promise<void>;
}) => {
  const { user } = useAuth();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const router = useRouter();
  interface notificationType {
    type: "BookingUpdate" | "AwaitingApproval" | "ReviewSubmitted" | "System";
  }

  const handleNotificationClick = (
    notifId: string,
    { type }: notificationType
  ) => {
    if (user?.role === "customer") {
      if (type === "BookingUpdate") {
        router.push("/customer-bookings");
        setPopoverOpen(false);
      } else if (type === "AwaitingApproval") {
        router.push("/customer-approval");
        setPopoverOpen(false);
      }
    } else if (user?.role === "service_provider") {
      if (type === "BookingUpdate") {
        router.push("/service-provider-bookings");
        setPopoverOpen(false);
      } else if (type === "ReviewSubmitted") {
        router.push("/service-provider-unread-reviews");
        setPopoverOpen(false);
      }
    }
  };

  return (
    <Popover
      open={popoverOpen}
      onOpenChange={(open) => {
        setPopoverOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <button className="relative">
          <FaBell className="text-white text-2xl hover:text-orange-500 transition duration-300" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white text-black rounded-lg shadow-lg p-4">
        <h4 className="text-sm font-semibold mb-2">Notifications</h4>
        {notifications.length > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs text-orange-600 hover:underline mb-2 ml-auto block"
          >
            Mark all as read
          </button>
        )}

        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500">No new notifications.</p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {notifications.map((notif) => (
              <li
                key={notif._id}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md cursor-pointer"
                onClick={() =>
                  handleNotificationClick(notif._id, { type: notif.type })
                }
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
