import React, { useEffect, useState } from "react";
import { getAllPosts } from "../actions/post.action";
import Image from "next/image";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaBookmark, FaRegBookmark, FaRegComment } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getUserLikedPosts, toogleLike } from "../actions/like.action";
import {
  getUserBookmarkedPosts,
  toogleBookmark,
} from "../actions/bookmark.action";
import { authClient } from "../lib/auth-client";
import { Session } from "better-auth";
import { SignupModal } from "./SignupModal";

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
  const [votedPosts, setVotedPosts] = useState<Set<string>>(new Set());
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});

  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(
    new Set()
  );
  const [bookmarkCounts, setBookmarkCounts] = useState<Record<string, number>>(
    {}
  );
  const [session, setSession] = useState<Session | null>(null);
  const [signUpmodal, setSignupmodal] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      const fetchSession = async () => {
            const result = await authClient.getSession();
            if (result?.data?.session) {
              setSession(result.data.session);
            } else {
              setSession(null);
            }
          };
          fetchSession();
      const [postsRes, likedRes, bookmarkRes] = await Promise.all([
        getAllPosts(),
        getUserLikedPosts(),
        getUserBookmarkedPosts(),
      ]);

      if (postsRes.success && postsRes.allPosts) {
        setPosts(postsRes.allPosts as PostWithRelations[]);

        // Initialize vote counts
        const counts: Record<string, number> = {};
        postsRes.allPosts.forEach((post: PostWithRelations) => {
          counts[post.id] = post._count.votes;
        });
        setVoteCounts(counts);

        //initialize bookmark counts
        const bookCounts: Record<string, number> = {};
        postsRes.allPosts.forEach((post: PostWithRelations) => {
          bookCounts[post.id] = post._count.bookmarks;
        });
        setBookmarkCounts(bookCounts);
      }

      // Set initially liked posts
      if (likedRes.success && likedRes.likedPostIds) {
        setVotedPosts(new Set(likedRes.likedPostIds));
      }

      if (bookmarkRes.success && bookmarkRes.bookmarkedPostIds) {
        setBookmarkedPosts(new Set(bookmarkRes.bookmarkedPostIds));
      }

      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handleVote = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    
    if (!session) {
      setSignupmodal(true);
      return;
    }

    // Store current state for rollback if needed
    const wasVoted = votedPosts.has(postId);
    const previousCount = voteCounts[postId] ?? 0;

    // OPTIMISTIC UPDATE - Update UI immediately
    setVotedPosts((prev) => {
      const newSet = new Set(prev);
      if (wasVoted) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });

    setVoteCounts((prev) => ({
      ...prev,
      [postId]: wasVoted ? previousCount - 1 : previousCount + 1,
    }));

    try {
      const res = await toogleLike(postId);

      if (res.success) {
        // Update with actual count from server
        if (res.voteCount !== undefined) {
          setVoteCounts((prev) => ({
            ...prev,
            [postId]: res.voteCount,
          }));
        }

        // Ensure voted state matches server response
        setVotedPosts((prev) => {
          const newSet = new Set(prev);
          if (res.isVoted) {
            newSet.add(postId);
          } else {
            newSet.delete(postId);
          }
          return newSet;
        });
      } else {
        // ROLLBACK - Revert optimistic update on error
        setVotedPosts((prev) => {
          const newSet = new Set(prev);
          if (wasVoted) {
            newSet.add(postId);
          } else {
            newSet.delete(postId);
          }
          return newSet;
        });

        setVoteCounts((prev) => ({
          ...prev,
          [postId]: previousCount,
        }));

        console.error("Error toggling vote:", res.error);
      }
    } catch (error) {
      // ROLLBACK on exception
      setVotedPosts((prev) => {
        const newSet = new Set(prev);
        if (wasVoted) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });

      setVoteCounts((prev) => ({
        ...prev,
        [postId]: previousCount,
      }));

      console.error("Error toggling vote:", error);
    }
  };

  const handleBookmark = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();

    if (!session) {
      setSignupmodal(true);
      return;
    }

    const wasBookmarked = bookmarkedPosts.has(postId);
    const previousBookmark = bookmarkCounts[postId] ?? 0;

    setBookmarkedPosts((prev) => {
      const newSet = new Set(prev);
      if (wasBookmarked) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });

    setBookmarkCounts((prev) => ({
      ...prev,
      [postId]: wasBookmarked ? previousBookmark - 1 : previousBookmark + 1,
    }));

    try {
      const res = await toogleBookmark(postId);
      if (res.success) {
        if (res.bookmarksCount !== undefined) {
          setBookmarkCounts((prev) => ({
            ...prev,
            [postId]: res.bookmarksCount,
          }));
        }

        setBookmarkedPosts((prev) => {
          const newSet = new Set(prev);
          if (res.isBookmarkAdded) {
            newSet.delete(postId);
          } else {
            newSet.add(postId);
          }
          return newSet;
        });
      } else {
        //revert to old bookmark count if failed
        setBookmarkedPosts((prev) => {
          const newSet = new Set(prev);
          if (wasBookmarked) {
            newSet.delete(postId);
          } else {
            newSet.add(postId);
          }
          return newSet;
        });

        setBookmarkCounts((prev) => ({
          ...prev,
          [postId]: previousBookmark,
        }));

        console.error("Error toggling bookmark:", res.error);
      }
    } catch (error) {
      setVotedPosts((prev) => {
        const newSet = new Set(prev);
        if (wasBookmarked) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });

      setVoteCounts((prev) => ({
        ...prev,
        [postId]: previousBookmark,
      }));

      console.error("Error toggling bookmark:", error);
    }
  };

  const handleSignup = async () => {
      try {
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "/",
        });
      } catch (err) {
        console.error("SignIn error:", err);
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
      {signUpmodal && (
        <SignupModal open={signUpmodal} onSignup={handleSignup} onClose={() => setSignupmodal(false)} />
      )}
      {posts.map((post) => {
        const isVoted = votedPosts.has(post.id);
        const voteCount = voteCounts[post.id] ?? post._count.votes;

        const isBookmarked = bookmarkedPosts.has(post.id);
        const bookmarkCount = bookmarkCounts[post.id] ?? post._count.bookmarks;

        return (
          <div
            onClick={() => {
              if(!session){
                setSignupmodal(true)
              }
              else {
                router.push(`/${post.user.email?.split("@")[0]}/${post.id}`);
              }
            }}
            key={post.id}
            className="w-full border-b border-neutral-800 p-4 bg-neutral-900 hover:bg-neutral-800/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <Image
                src={post.user?.image || "/default-avatar.png"}
                alt={post.user?.name || "User"}
                width={40}
                height={40}
                className="rounded-full flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
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

                <p className="text-white text-[15px] mb-3 leading-relaxed break-words">
                  {post.message}
                </p>

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

                <div className="flex items-center justify-between text-neutral-500 max-w-md pt-2">
                  <button
                    onClick={(e) => {
                      if (!session) {
                        setSignupmodal(true);
                        return;
                      }
                      e.stopPropagation();
                      router.push(
                        `/${post.user.email?.split("@")[0]}/${post.id}`
                      );
                    }}
                    className="flex items-center gap-2 rounded-full hover:text-blue-700 transition-colors group"
                  >
                    <FaRegComment
                      size={18}
                      className="group-hover:scale-110 transition-transform"
                    />
                    {post._count.comments > 0 && (
                      <span className="text-sm">{post._count.comments}</span>
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      if (!session) {
                        setSignupmodal(true);
                        return;
                      }
                      handleVote(e, post.id);
                    }}
                    className={`flex items-center gap-2 rounded-full transition-colors group ${
                      isVoted ? "text-red-700" : "hover:text-red-700"
                    }`}
                  >
                    {isVoted ? (
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
                    {voteCount > 0 && (
                      <span className="text-sm">{voteCount}</span>
                    )}
                  </button>

                  <button 
                    onClick={(e) => {
                      if (!session) {
                        setSignupmodal(true);
                        return;
                      }
                      handleBookmark(e, post.id);
                    }}
                    className={`flex items-center gap-2 rounded-full transition-colors group ${
                      isBookmarked ? "text-emerald-500" : "hover:text-emerald-500"
                    }`}
                  >
                    {isBookmarked ? (
                      <FaBookmark
                        size={18}
                        className="group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <FaRegBookmark
                        size={18}
                        className="group-hover:scale-110 transition-transform"
                      />
                    )}
                    {bookmarkCount > 0 && (
                      <span className="text-sm">{bookmarkCount}</span>
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
