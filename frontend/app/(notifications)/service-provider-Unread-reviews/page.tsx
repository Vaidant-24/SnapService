"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth();

  useEffect(() => {
    const fetchUnreadReviews = async () => {
      if (!user?.userId) return;

      try {
        const res = await fetch(
          `http://localhost:3001/review/provider-unread/${user.userId}`
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
        setLoading(false);
      }
    };

    fetchUnreadReviews();
  }, [user]);

  const handleMarkAllAsRead = async () => {
    if (!user?.userId) return;
    setMarking(true);

    try {
      await fetch(`http://localhost:3001/review/mark-read/${user.userId}`, {
        method: "PATCH",
      });

      // Update state to reflect all reviews as read
      setReviews((prev) => prev.map((review) => ({ ...review, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all reviews as read", err);
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto my-12">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const unreadReviews = reviews.filter((r) => !r.isRead);

  return (
    <div className="w-full max-w-2xl my-24 mx-auto bg-gray-900">
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
            <p className="text-sm text-muted-foreground">No unread reviews.</p>
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
  );
}
