import React, { useEffect, useState } from "react";
import { getAllPosts } from "../actions/post.action";
import Image from "next/image";
import { BiComment, BiBookmark } from "react-icons/bi";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Custom type that matches your Prisma query in getAllPosts
interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface PostWithRelations {
  id: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  postImage: string | null;
  user: User;
  _count: {
    comments: number;
    votes: number;
    bookmarks: number;
  };
}

const PostSkeleton = () => (
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

const Posts = () => {
  const router = useRouter()
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const res = await getAllPosts();
      if (res.success && res.allPosts) {
        setPosts(res.allPosts as PostWithRelations[]);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  function formatPostDate(date: Date) {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours}h`;
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="space-y-0">
        {[...Array(5)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {posts.map((post) => (
        <div
        onClick={() => {router.push(`/${post.user.email?.split("@")[0]}/${post.id}`)}}
          key={post.id}
          className="w-full border-b border-neutral-800 p-4 bg-neutral-900 hover:bg-neutral-800/50 transition-colors cursor-pointer"
        >
          <div className="flex items-start gap-3">
            {/* User avatar */}
            <Image
              src={post.user?.image || "/default-avatar.png"}
              alt={post.user?.name || "User"}
              width={40}
              height={40}
              className="rounded-full flex-shrink-0"
            />

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
                  @{post.user.email?.split("@")[0] || "anonymous"}
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
                    width={30}
                    height={30}
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* Engagement actions */}
              <div className="flex items-center justify-between text-neutral-500 max-w-md pt-2">
                {/* Comments */}
                <button className="flex items-center gap-2 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-colors group">
                  <FaRegComment
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                  />
                  {post._count.comments > 0 && (
                    <span className="text-sm">{post._count.comments}</span>
                  )}
                </button>

                {/* Votes/Likes */}
                <button className="flex items-center gap-2 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors group">
                  <AiOutlineHeart
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                  />
                  {post._count.votes > 0 && (
                    <span className="text-sm">{post._count.votes}</span>
                  )}
                </button>

                {/* Bookmarks */}
                <button className="flex items-center gap-2 rounded-full hover:bg-green-500/10 hover:text-green-500 transition-colors group">
                  <BiBookmark
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                  />
                  {post._count.bookmarks > 0 && (
                    <span className="text-sm">{post._count.bookmarks}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
