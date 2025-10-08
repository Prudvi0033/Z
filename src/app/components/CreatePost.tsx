"use client";
import React, { useState, useEffect } from "react";
import { BsEmojiSunglasses, BsFillImageFill } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "sonner";
import { authClient } from "../lib/auth-client";
import { createPost } from "../actions/post.action";
import { SignupModal } from "./SignupModal";
import { Session } from "better-auth";

const CreatePost = () => {
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignin, setShowSignin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  // ✅ fetch session once on mount
  useEffect(() => {
    const fetchSession = async () => {
      const result = await authClient.getSession();
      if (result?.data?.session) {
        setSession(result.data.session);
      } else {
        setSession(null);
      }
    };
    fetchSession();
  }, []);

  const handlePost = async () => {
    if (!session) {
      setShowSignin(true);
      return;
    }

    try {
      setLoading(true);
      const res = await createPost(post);
      if (res.success) {
        setPost("");
        toast("Post Created");
      } else {
        toast("Error in creating post");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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

  return (
    <>
      <div className="w-full border border-neutral-800 p-6 shadow-[4px_4px_4px_rgba(0,0,0,0.1),-4px_-4px_4px_rgba(0,0,0,0.08)] rounded-xl">
        <textarea
          placeholder="What's happening?"
          rows={3}
          value={post}
          onChange={(e) => setPost(e.target.value)}
          className="w-full pb-2 outline-none resize-none overflow-hidden placeholder:text-neutral-600 text-lg text-white border-b border-neutral-800"
        />

        <div className="flex items-center w-full justify-between gap-x-6">
          <div className="flex items-center w-full gap-x-3">
            <span className="hover:bg-white/10 p-2 rounded-full cursor-pointer">
              <BsFillImageFill size={20} className="text-neutral-300" />
            </span>
            <span className="hover:bg-white/10 p-2 rounded-full cursor-pointer">
              <BsEmojiSunglasses size={20} className="text-neutral-300" />
            </span>
          </div>

          <button
            onClick={handlePost}
            disabled={post.trim().length < 1 || loading}
            className="text-[14px] font-bold px-4 py-2 rounded-md cursor-pointer transition-all
              bg-white text-black 
              disabled:bg-neutral-500/50 disabled:text-neutral-200 disabled:cursor-not-allowed"
          >
            {loading ? (
              <AiOutlineLoading3Quarters size={20} className="animate-spin" />
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>

      {/* 👇 Signup Modal */}
      <SignupModal
        open={showSignin}
        onClose={() => setShowSignin(false)}
        onSignup={handleSignup}
      />
    </>
  );
};

export default CreatePost;
