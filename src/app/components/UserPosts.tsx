import React, { useEffect, useState } from 'react'
import { getUserPosts } from '../actions/post.action';
import { toast } from 'sonner';
import Image from "next/image";
import { BiBookmark } from "react-icons/bi";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { formatPostDate } from '../lib/DateFormatter';

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

const UserPosts = () => {
    const [posts, setPosts] = useState<PostWithRelations[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchUserPosts = async () => {
            setLoading(true)
            try {
                const res = await getUserPosts();
                if(res.sucess){
                    setPosts(res.userPosts)
                }
                else{
                    toast("Error in fetching user posts")
                    setLoading(false)
                }
            } catch (error) {
                console.log(error);
            }
            finally{
                setLoading(false)
            }
        }

        fetchUserPosts()
    },[])


    if(loading){
        return (
            <div className="space-y-0">
                {[...Array(5)].map((_, i) => (
                    <PostSkeleton key={i} />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-0">
            {posts.map((post) => (
                <div
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
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default UserPosts