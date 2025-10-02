import React, { useState } from "react";
import { BsEmojiSunglasses, BsFillImageFill } from "react-icons/bs";
import { FaImage } from "react-icons/fa";
import { auth } from "../lib/auth";
import { authClient } from "../lib/auth-client";
import { createPost } from "../actions/post.action";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const CreatePost = () => {
  const [post, setPost] = useState("");
  const [loading, setLoding] = useState(false);
  const [showSignin, setShowsignin] = useState(false);

  const session = authClient.getSession();
  const handlePost = async () => {
    if (!session) {
      setShowsignin(true);
      return;
    }

    try {
      setLoding(true);
      const res = await createPost(post);
      if (res.sucess) {
        setPost("");
        toast("Post Created")
      } else {
        toast("Error in creating post");
      }
    } catch (error) {
      console.log(error);
      setLoding(false);
    } finally {
      setLoding(false);
    }
  };
  return (
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
          className="text-[13px] text-black font-semibold px-4 py-2 bg-neutral-300 rounded-4xl cursor-pointer"
        >
          {loading ? (
            <AiOutlineLoading3Quarters size={24} className="animate-spin" />
          ) : (
            "Post"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
