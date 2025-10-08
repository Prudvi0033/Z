"use client";
import React, { useEffect, useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { formatPostDateTime } from "../lib/DateFormatter";
import { FaUserLarge } from "react-icons/fa6";
import Image from "next/image";
import { toast } from "sonner";
import { getNotifications } from "../actions/notification.action";
import { Bell, Heart } from "lucide-react";

const inter = Space_Grotesk({ subsets: ["latin"] });

interface User {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
}

interface Post {
  id: string;
  message: string;
}

interface Notification {
  id: string;
  type: "LIKE" | "FOLLOW";
  isRead: boolean;
  createdAt: Date;
  triggeredBy: User;
  post?: Post | null;
}

const NotificationSkeleton = () => (
  <div className="w-full border-b border-neutral-800 p-4 bg-neutral-900 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-neutral-800 flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-32 bg-neutral-800 rounded" />
          <div className="h-3 w-20 bg-neutral-800 rounded" />
        </div>
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-neutral-800 rounded w-5/6" />
          <div className="h-4 bg-neutral-800 rounded w-3/6" />
        </div>
        <div className="h-3 w-24 bg-neutral-800 rounded" />
      </div>
    </div>
  </div>
);

const Notifications = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await getNotifications();
        
        console.log("API Response:", res); // Debug log
        
        if (res?.success && res.notifications) {
          setNotifications(res.notifications);
        } else {
          toast.error(res?.error || "Error in fetching notifications");
        }
      } catch (error) {
        console.log("Fetch error:", error);
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "LIKE":
        return <Heart className="w-8 h-8 text-red-700" fill="currentColor" />;
      case "FOLLOW":
        return <FaUserLarge className="w-8 h-8 text-emerald-600" />;
      default:
        return <Bell className="w-8 h-8 text-neutral-500" />;
    }
  };

  const getNotificationText = (notification: Notification) => {
    const name = notification.triggeredBy?.name || "Someone";

    switch (notification.type) {
      case "LIKE":
        return (
          <div className="flex flex-col gap-1">
            <div>
              <span className="font-semibold text-white">{name}</span>
              <span className="text-neutral-400"> liked your post</span>
            </div>
            {notification.post && (
              <p className="text-neutral-500 text-sm line-clamp-2">
                {notification.post.message}
              </p>
            )}
          </div>
        );
      case "FOLLOW":
        return (
          <div>
            <span className="font-semibold text-white">{name}</span>
            <span className="text-neutral-400"> started following you</span>
          </div>
        );
      default:
        return <span className="text-neutral-400">New notification</span>;
    }
  };

  return (
    <div
      className={`w-[42rem] selection:bg-neutral-300/40 h-screen bg-neutral-900 border-r border-l border-neutral-800 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent hover:scrollbar-thumb-neutral-500 ${inter.className}`}
    >
      {/* Top bar */}
      <div className="flex gap-x-6 text-xl text-neutral-100 px-8 items-center h-12 w-full bg-neutral-700/20 border-b border-neutral-800 sticky top-0 z-10">
        <FaArrowLeft
          onClick={() => {
            router.back();
          }}
          size={16}
          className="cursor-pointer hover:text-white transition-colors"
        />
        <span>Notifications</span>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-0">
          {[...Array(6)].map((_, i) => (
            <NotificationSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <Bell className="w-16 h-16 text-neutral-600 mb-4" />
          <h3 className="text-white text-xl font-semibold mb-2">
            No notifications yet
          </h3>
          <p className="text-neutral-500 text-center">
            When someone likes or follows you, you'll see it here
          </p>
        </div>
      )}

      {/* Notifications list */}
      {!loading && notifications.length > 0 && (
        <div className="space-y-0">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="w-full border-b border-neutral-800 p-4 bg-neutral-900 hover:bg-neutral-800/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                {/* Notification icon */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  {/* User avatar and content */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-3">
                      <Image
                        src={
                          notification.triggeredBy?.image ||
                          "/default-avatar.png"
                        }
                        alt={notification.triggeredBy?.name || "User"}
                        width={45}
                        height={45}
                        className="rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[15px] leading-relaxed">
                          {getNotificationText(notification)}
                        </div>
                        <span className="text-neutral-500 text-sm">
                          {formatPostDateTime(new Date(notification.createdAt))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;