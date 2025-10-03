"use client";
import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "sonner";
import { createComment } from "../actions/comment.action";

type PostRplyProps = {
  postId: string;
};

const PostReply = ({ postId }: PostRplyProps) => {
  const [comment, setComment] = useState<string>(""); 
  const [loading, setLoading] = useState(false);

  const createCmnt = async () => {
    try {
        setLoading(true)
        const res = await createComment(postId, comment)
        if(res.success){
            toast("Reply Posted")
            setComment("")
        }
    } catch (error) {
        console.log(error);
        toast("Error in posting Comment")
        setLoading(false)
    } finally {
        setLoading(false)
    }
  };

  return (
    <div className="">
      <textarea
        className="w-full px-6 py-6 text-lg outline-none overflow-hidden text-white resize-none placeholder:text-neutral-400"
        placeholder="Post a reply"
        rows={1}
        value={comment} 
        onChange={(e) => setComment(e.currentTarget.value)} 
      />
      <div className="flex justify-end px-6 py-3 w-full border-b border-neutral-800">
        <button
          onClick={createCmnt}
          disabled={loading}
          className="text-[14px] text-black font-bold px-4 py-2 bg-white rounded-md cursor-pointer"
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

export default PostReply;
