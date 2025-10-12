"use client";
import React, { useState, useEffect, useRef } from "react";
import { BsEmojiSunglasses, BsFillImageFill } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "sonner";
import { authClient } from "../lib/auth-client";
import { createPost } from "../actions/post.action";
import { SignupModal } from "./SignupModal";
import { Session } from "better-auth";

interface OnPostCreatedProps {
  onPostCreated: () => void;
}

const CreatePost = ({ onPostCreated }: OnPostCreatedProps) => {
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignin, setShowSignin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // ✅ Changed to false
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // ✅ Fixed typo

  const popularEmojis = ["😊", "😂", "❤️", "👍", "🔥"];
  
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

  //closing emoji picker when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showEmojiPicker]);

  const handleEmojiClick = (emoji: string) => {
    const textarea = textareaRef.current; // ✅ Fixed typo
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newText = post.slice(0, start) + emoji + post.slice(end);
      setPost(newText);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setPost(post + emoji);
    }
  };

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
        onPostCreated();
      } else {
        toast("Error in creating post");
      }
    } catch (error) {
      console.log(error);
      toast("Error in creating post"); // ✅ Added error toast
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
          ref={textareaRef} // ✅ Added ref
          placeholder="What's happening?"
          rows={3}
          value={post}
          onChange={(e) => setPost(e.target.value)}
          className="w-full pb-2 outline-none resize-none overflow-hidden placeholder:text-neutral-600 text-lg text-white border-b border-neutral-800"
        />

        <div className="flex items-center w-full justify-between gap-x-6">
          <div className="flex items-center w-full gap-x-3 relative">
            <span className="hover:bg-white/10 p-2 rounded-full cursor-pointer">
              <BsFillImageFill size={20} className="text-neutral-300" />
            </span>
            
            <div className="relative">
              <span
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="hover:bg-white/10 p-2 rounded-full cursor-pointer block"
              >
                <BsEmojiSunglasses size={20} className="text-neutral-300" />
              </span>

              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute top-full left-0 mt-2 bg-neutral-800 border border-neutral-700 py-2 px-2 shadow-lg rounded-lg z-50"
                >
                  <div className="flex gap-1">
                    {popularEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          handleEmojiClick(emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-2xl hover:bg-neutral-700 rounded-md p-2 transition-all hover:scale-110 active:scale-95"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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

      <SignupModal
        open={showSignin}
        onClose={() => setShowSignin(false)}
        onSignup={handleSignup}
      />
    </>
  );
};

export default CreatePost;