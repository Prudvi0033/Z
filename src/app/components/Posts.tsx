import React, { useEffect, useState } from "react";
import { getAllPosts } from "../actions/post.action";
import Image from "next/image";
import { BiBookmark } from "react-icons/bi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toogleLike } from "../actions/likes.action";

// Extended interface to include like information
interface PostWithRelations {
  id: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  postImage: string | null;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  _count: {
    comments: number;
    votes: number;
    bookmarks: number;
  };
  hasLiked?: boolean; // Added: whether current user liked this post
  likesCount?: number; // Added: actual like count
}

const PostSkeleton = () => (
  <div className="w-full border-b border-neutral-800 p-4 bg-neutral-900 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 rounded-full bg-neutral-800 flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-32 bg-neutral-800 rounded" />
          <div className="h-3 w-20 bg-neutral-800 rounded" />
          <div className="h-3 w-12 bg-neutral-800 rounded ml-auto" />
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-neutral-800 rounded w-full" />
          <div className="h-4 bg-neutral-800 rounded w-5/6" />
          <div className="h-4 bg-neutral-800 rounded w-4/6" />
        </div>
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
  const router = useRouter();
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(false);

  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const res = await getAllPosts();
      if (res.success && res.allPosts) {
        setPosts(res.allPosts as PostWithRelations[]);
        
        // Initialize like counts and liked posts
        const counts: Record<string, number> = {};
        const liked = new Set<string>();
        
        res.allPosts.forEach((post: PostWithRelations) => {
          // Use likesCount if provided by backend, otherwise fallback to _count.votes
          counts[post.id] = post.likesCount ?? post._count.votes;
          
          // Check if user has already liked this post
          if (post.hasLiked) {
            liked.add(post.id);
          }
        });
        
        setLikeCounts(counts);
        setLikedPosts(liked);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handleLike = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation(); 
    
    const wasLiked = likedPosts.has(postId);
    const newLikedPosts = new Set(likedPosts);
    
    if (wasLiked) {
      newLikedPosts.delete(postId);
      setLikeCounts(prev => ({ ...prev, [postId]: Math.max(0, (prev[postId] || 0) - 1) }));
    } else {
      newLikedPosts.add(postId);
      setLikeCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
    }
    
    setLikedPosts(newLikedPosts);

    const result = await toogleLike(postId);
    
    if (!result.success) {
      setLikedPosts(likedPosts);
      setLikeCounts(prev => {
        const newCounts = { ...prev };
        newCounts[postId] = wasLiked 
          ? (prev[postId] || 0) + 1 
          : Math.max(0, (prev[postId] || 0) - 1);
        return newCounts;
      });
      console.error("Failed to toggle like:", result.error);
    }
  };

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
      {posts.map((post) => {
        const isLiked = likedPosts.has(post.id);
        const likeCount = likeCounts[post.id] || 0;
        
        return (
          <div
            onClick={() => {
              router.push(`/${post.user.email?.split("@")[0]}/${post.id}`);
            }}
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
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-colors group"
                  >
                    <FaRegComment
                      size={18}
                      className="group-hover:scale-110 transition-transform"
                    />
                    {post._count.comments > 0 && (
                      <span className="text-sm">{post._count.comments}</span>
                    )}
                  </button>

                  {/* Votes/Likes */}
                  <button
                    onClick={(e) => handleLike(e, post.id)}
                    className={`flex items-center gap-2 rounded-full transition-colors group ${
                      isLiked ? "text-red-500" : "hover:text-red-500 hover:bg-red-500/10"
                    }`}
                  >
                    {isLiked ? (
                      <AiFillHeart
                        size={18}
                        className="group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={18}
                        className="group-hover:scale-110 transition-transform"
                      />
                    )}
                    {likeCount > 0 && (
                      <span className="text-sm">{likeCount}</span>
                    )}
                  </button>

                  {/* Bookmarks */}
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 rounded-full hover:bg-green-500/10 hover:text-green-500 transition-colors group"
                  >
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
        );
      })}
    </div>
  );
};

export default Posts;