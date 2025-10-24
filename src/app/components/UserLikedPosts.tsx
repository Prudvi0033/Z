import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AiOutlineHeart } from "react-icons/ai";
import { formatPostDate } from "../lib/DateFormatter";
import { getLikedPostsForUser } from "../actions/like.action";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
}

interface LikedPost {
  id: string;
  message: string;
  createdAt: Date;
  postImage: string | null;
  user: User;
}

const LikedPostSkeleton = () => (
  <div className="w-full border-b border-neutral-800 p-4 bg-neutral-900 animate-pulse">
    <div className="flex items-start gap-3">
      {/* Avatar skeleton */}
      <div className="w-12 h-12 rounded-full bg-neutral-800 flex-shrink-0" />

      <div className="flex-1">
        {/* User info skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-32 bg-neutral-800 rounded" />
          <div className="h-3 w-20 bg-neutral-800 rounded" />
          <div className="h-3 w-12 bg-neutral-800 rounded ml-auto" />
        </div>

        {/* Message skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-neutral-800 rounded w-full" />
          <div className="h-4 bg-neutral-800 rounded w-5/6" />
          <div className="h-4 bg-neutral-800 rounded w-4/6" />
        </div>

        {/* Engagement skeleton */}
        <div className="flex gap-8">
          <div className="h-5 w-16 bg-neutral-800 rounded" />
          <div className="h-5 w-16 bg-neutral-800 rounded" />
          <div className="h-5 w-16 bg-neutral-800 rounded" />
        </div>
      </div>
    </div>
  </div>
);

const UserLikedPosts = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<LikedPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      setLoading(true);
      try {
        const res = await getLikedPostsForUser();
        if (res.sucess) {
          setPosts(res.likedPosts);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPosts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-0">
        {[...Array(5)].map((_, i) => (
          <LikedPostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <AiOutlineHeart className="w-16 h-16 text-neutral-600 mb-4" />
        <h3 className="text-white text-xl font-semibold mb-2">
          No liked posts yet
        </h3>
        <p className="text-neutral-500 text-center">
          Posts you like will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() => {
            router.push(`/${post.user.email?.split("@")[0]}/${post.id}`);
          }}
          className="w-full border-b border-neutral-800 p-4 bg-neutral-900 hover:bg-neutral-800/50 transition-colors cursor-pointer"
        >
          <div className="flex items-start gap-3">
            {/* User avatar */}
            <div>
              {post.user?.image ? (
                <Image
                  src={post.user?.image || "/default-avatar.png"}
                  alt={post.user?.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-neutral-700 text-white flex items-center justify-center flex-shrink-0 font-semibold">
                  {post.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* User info and timestamp */}
              <div className="flex flex-col mb-2">
                <span className="text-white flex gap-x-2 font-semibold text-[14px]">
                  {post.user?.name || "Anonymous"}

                  <div className="flex gap-2">
                    <span className="text-neutral-500 text-[14px]">·</span>
                    <span className="text-neutral-500 text-[14px]">
                      {formatPostDate(new Date(post.createdAt))}
                    </span>
                  </div>
                </span>
                <span className="text-neutral-500 text-[14px]">
                  @
                  {post.user?.email
                    ? post.user.email.split("@")[0]
                    : "anonymous"}
                </span>
              </div>

              {/* Post message */}
              <p className="text-white text-[15px] mb-3 leading-relaxed break-words">
                {post.message}
              </p>

              {/* Post image if exists */}
              {post.postImage && (
                <div className="mb-3 rounded-2xl overflow-hidden border border-neutral-800">
                  <Image
                    src={post.postImage}
                    alt="Post image"
                    width={500}
                    height={500}
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserLikedPosts;
