"use client";

import { useEffect, useState } from "react";
import { Loader, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { MdOutlineSync } from "react-icons/md";
import AuthGuard from "@/components/auth/AuthGuard";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  serviceName: string;
  createdAt: string;
  isRead: boolean;
  customerId: {
    firstName: string;
    lastName: string;
  };
}

export default function ProviderReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const { user: userData } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (userData && userData.role !== "service_provider") {
      router.push("/unauthorized");
    }
  }, [userData, router]);

  const fetchUnreadReviews = async () => {
    if (!userData?.userId) return;

    try {
      setRefreshing(true);
      const res = await fetch(
        `http://localhost:3001/review/provider-unread/${userData.userId}`
      );
      const data: Review[] = await res.json();

      const sorted = data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setReviews(sorted);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadReviews();
  }, [userData]);

  const handleMarkAllAsRead = async () => {
    if (!userData?.userId) return;
    setMarking(true);

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/review/mark-read/${userData?.userId}`,
        {
          method: "PATCH",
        }
      );

      // Update state to reflect all reviews as read
      setReviews((prev) => prev.map((review) => ({ ...review, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all reviews as read", err);
    } finally {
      setMarking(false);
    }
  };

  if (!userData || userData.role !== "service_provider" || loading) {
    return (
      <AuthGuard>
        <div className="rounded-lg shadow-lg my-12 h-64 flex flex-col items-center justify-center">
          <Loader className="h-10 w-10 text-orange-500 animate-spin mb-4" />
          <p className="text-gray-300">Loading reviews...</p>
          <Toaster position="top-right" richColors />
        </div>
      </AuthGuard>
    );
  }

  const unreadReviews = reviews.filter((r) => !r.isRead);

  return (
    <AuthGuard>
      <div className="min-h-screen container mx-auto mt-24 px-4 ">
        <div className="flex justify-between mx-auto items-center mb-8 ">
          <h3 className="text-2xl text-orange-500 font-semibold ">
            Recent Reviews
          </h3>
          <button
            onClick={fetchUnreadReviews}
            className="flex items-center gap-2 text-green-500 hover:text-green-700"
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader className="w-9 h-9 animate-spin" />
            ) : (
              <MdOutlineSync className="w-9 h-9" />
            )}
          </button>
        </div>
        <Card className="w-full">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-xl font-semibold">
              Unread Reviews
            </CardTitle>
            {unreadReviews.length > 0 && (
              <Button
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={marking}
                variant="outline"
              >
                {marking ? "Marking..." : "Mark All as Read"}
              </Button>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {unreadReviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No unread reviews.
              </p>
            ) : (
              unreadReviews.map((review) => (
                <div
                  key={review._id}
                  className="border rounded-2xl p-4 shadow-sm bg-muted/30"
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                          fill={i < review.rating ? "#facc15" : "none"}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-primary">
                    {review.customerId?.firstName} {review.customerId?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    {review.serviceName}
                  </p>
                  <p className="text-sm mt-1 text-gray-400">{review.comment}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
