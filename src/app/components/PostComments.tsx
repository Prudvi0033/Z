import React, { useEffect, useState } from "react";
import { getPostComments, deleteComment } from "../actions/comment.action";
import Image from "next/image";
import { formatPostDateTime } from "../lib/DateFormatter";
import { FaTrash } from "react-icons/fa";

type PostCommentsProps = {
  postId: string;
  currentUserId?: string;
};

type Comment = {
  id: string;
  description: string;
  createdAt: string | Date;
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
};

const PostComments = ({ postId, currentUserId }: PostCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await getPostComments(postId);
        if (res.success && res.comments) {
          setComments(res.comments as Comment[]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleDeleteComment = async (commentId: string) => {
    setDeletingId(commentId);
    try {
      const res = await deleteComment(commentId);
      if (res.success) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingId(null);
    }
  };

  const CommentsLoadingSkeleton = () => {
    return (
      <div className="w-full bg-neutral-900">
        {/* Render 3 comment skeletons */}
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="border-b border-neutral-800 p-4 animate-pulse"
          >
            <div className="flex items-start gap-2">
              {/* Avatar skeleton */}
              <div className="w-10 h-10 rounded-full bg-neutral-700"></div>

              <div className="flex-1">
                {/* User info skeleton */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-2 items-center">
                      {/* Name skeleton */}
                      <div className="h-3 w-24 bg-neutral-700 rounded"></div>
                      {/* Dot */}
                      <div className="h-1 w-1 bg-neutral-700 rounded-full"></div>
                      {/* Timestamp skeleton */}
                      <div className="h-3 w-16 bg-neutral-700 rounded"></div>
                    </div>
                    {/* Username skeleton */}
                    <div className="h-3 w-20 bg-neutral-700 rounded"></div>
                  </div>
                </div>

                {/* Comment description skeleton */}
                <div className="mt-2 space-y-2">
                  <div className="h-3 w-full bg-neutral-700 rounded"></div>
                  <div className="h-3 w-4/5 bg-neutral-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div>
        <CommentsLoadingSkeleton/>
      </div>
    );
  }


  return (
    <div className="w-full bg-neutral-900">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="border-b border-neutral-800 p-4 hover:bg-neutral-800/50 transition-colors"
        >
          {/* User info with avatar */}
          <div className="flex items-start gap-2">
            <Image
              src={comment.user?.image || "/default-avatar.png"}
              alt={comment.user?.name || "User"}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <div className="flex w-full gap-x-2 items-center">
                      <span className="text-white font-bold text-sm">
                        {comment.user?.name || "Anonymous"}
                      </span>
                      <span className="text-neutral-500 text-xs">·</span>
                      <span className="text-neutral-500 text-xs">
                        {formatPostDateTime(new Date(comment.createdAt))}
                      </span>
                    </div>
                    <span className="text-neutral-500 text-xs">
                      @{comment.user.email?.split("@")[0] || "anonymous"}
                    </span>
                  </div>
                </div>

                {/* Delete button - only show if current user owns the comment */}
                {currentUserId && currentUserId === comment.userId && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={deletingId === comment.id}
                    className="text-neutral-500 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Delete comment"
                  >
                    <FaTrash size={14} />
                  </button>
                )}
              </div>

              {/* Comment description */}
              <p className="text-white text-sm leading-normal mt-2">
                {comment.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostComments;
