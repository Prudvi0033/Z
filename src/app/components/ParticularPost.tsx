import React, { useEffect, useState } from "react";
import { getPostById } from "../actions/post.action";
import Image from "next/image";
import { formatPostDateTime } from "../lib/DateFormatter";

type PostIdProps = {
  postId: string;
};

type Post = {
  id: string;
  message: string;
  postImage?: string | null;
  createdAt: string | Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  _count: {
    comments: number;
    votes: number;
    bookmarks: number;
  };
};

const ParticularPost = ({ postId }: PostIdProps) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await getPostById(postId);
        if (res.success) {
          setPost(res.post as Post);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const PostLoadingSkeleton = () => {
    return (
      <div className="w-full border-b border-neutral-800 p-4 bg-neutral-900 animate-pulse">
        {/* User info skeleton */}
        <div className="flex items-center gap-2 mb-3">
          {/* Avatar skeleton */}
          <div className="w-12 h-12 rounded-full bg-neutral-700"></div>
          <div className="flex-1">
            {/* Name skeleton */}
            <div className="h-4 w-32 bg-neutral-700 rounded mb-2"></div>
            {/* Username skeleton */}
            <div className="h-3 w-24 bg-neutral-700 rounded"></div>
          </div>
        </div>

        {/* Post message skeleton - just 2 lines */}
        <div className="mb-3 space-y-2">
          <div className="h-4 w-full bg-neutral-700 rounded"></div>
          <div className="h-4 w-3/4 bg-neutral-700 rounded"></div>
        </div>

        {/* Timestamp skeleton */}
        <div className="mb-4">
          <div className="h-3 w-32 bg-neutral-700 rounded"></div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 mb-4"></div>

        {/* Actions skeleton */}
        <div className="flex items-center justify-around gap-6">
          {/* Comment icon skeleton */}
          <div className="w-5 h-5 bg-neutral-700 rounded"></div>

          {/* Votes icon skeleton */}
          <div className="w-5 h-5 bg-neutral-700 rounded"></div>

          {/* Bookmarks icon skeleton */}
          <div className="w-5 h-5 bg-neutral-700 rounded"></div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div>
        <PostLoadingSkeleton />
      </div>
    );
  }

  if (!post) {
    return <div><PostLoadingSkeleton/></div>;
  }

  return (
    <div className="w-full border-b border-neutral-800 p-4 bg-neutral-900">
      {/* User info with avatar */}
      <div className="flex items-center gap-2 mb-3">
        <Image
          src={post.user?.image || "/default-avatar.png"}
          alt={post.user?.name || "User"}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <div className="text-white font-bold text-base">
            {post.user?.name || "Anonymous"}
          </div>
          <div className="text-neutral-500 text-sm">
            @{post.user.email?.split("@")[0] || "anonymous"}
          </div>
        </div>
      </div>

      {/* Post message */}
      <p className="text-white text-base mb-3 leading-normal">{post.message}</p>

      {/* Post image if exists */}
      {post.postImage && (
        <div className="mb-3 rounded-2xl overflow-hidden">
          <Image
            src={post.postImage}
            alt="Post image"
            width={600}
            height={400}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Timestamp */}
      <div className="text-neutral-500 text-sm mb-4">
        {formatPostDateTime(new Date(post.createdAt))}
      </div>
    </div>
  );
};

export default ParticularPost;