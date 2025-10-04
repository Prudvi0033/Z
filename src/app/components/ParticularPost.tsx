import React, { useEffect, useState } from "react";
import { getPostById } from "../actions/post.action";
import { toogleLike } from "../actions/likes.action";
import Image from "next/image";
import { formatPostDateTime } from "../lib/DateFormatter";
import { BiBookmark } from "react-icons/bi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";

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
  hasLiked?: boolean; // Whether current user has liked this post
  likesCount?: number; // Actual like count
};

const ParticularPost = ({ postId }: PostIdProps) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await getPostById(postId);
        if (res.success && res.post) {
          const fetchedPost = res.post as Post;
          setPost(fetchedPost);
          
          // Initialize like state
          setIsLiked(fetchedPost.hasLiked || false);
          
          // FIXED: Use likesCount if it exists (even if 0), otherwise fallback
          setLikeCount(
            fetchedPost.likesCount !== undefined 
              ? fetchedPost.likesCount 
              : fetchedPost._count.votes
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = async () => {
    if (!post) return;
    
    // Optimistic update
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikeCount(prev => wasLiked ? Math.max(0, prev - 1) : prev + 1);

    // Call the server action
    const result = await toogleLike(post.id);
    
    if (!result.success) {
      // Revert optimistic update on error
      setIsLiked(wasLiked);
      setLikeCount(prev => wasLiked ? prev + 1 : Math.max(0, prev - 1));
      console.error("Failed to toggle like:", result.error);
      // Consider showing a toast/notification to user
    }
  };

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
        <div className="mb-3 rounded-2xl overflow-hidden border border-neutral-800">
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

      {/* Divider */}
      <div className="border-t border-neutral-800 mb-4"></div>

      {/* Actions */}
      <div className="flex items-center justify-around gap-6 text-neutral-500">
        {/* Comments */}
        <button className="flex items-center gap-2 hover:text-blue-500 hover:bg-blue-500/10 transition-colors rounded-full p-2 group">
          <FaRegComment size={18} className="group-hover:scale-110 transition-transform" />
          {post._count.comments > 0 && (
            <span className="text-sm">{post._count.comments}</span>
          )}
        </button>

        {/* Votes/Likes */}
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors rounded-full p-2 group ${
            isLiked 
              ? "text-red-500" 
              : "hover:text-red-500 hover:bg-red-500/10"
          }`}
        >
          {isLiked ? (
            <AiFillHeart size={20} className="group-hover:scale-110 transition-transform" />
          ) : (
            <AiOutlineHeart size={20} className="group-hover:scale-110 transition-transform" />
          )}
          {likeCount > 0 && (
            <span className="text-sm">{likeCount}</span>
          )}
        </button>

        {/* Bookmarks */}
        <button className="flex items-center gap-2 hover:text-green-500 hover:bg-green-500/10 transition-colors rounded-full p-2 group">
          <BiBookmark size={20} className="group-hover:scale-110 transition-transform" />
          {post._count.bookmarks > 0 && (
            <span className="text-sm">{post._count.bookmarks}</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ParticularPost;