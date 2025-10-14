"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { BsEmojiSunglasses, BsFillImageFill } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const textarea = textareaRef.current;
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

  const handleImageClick = () => {
    if (!session) {
      setShowSignin(true);
      return;
    }
    setShowImageModal(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        toast.error("Only PNG, JPG, JPEG and GIF images are supported");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setShowImageModal(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Alpha_One"); // Replace with your Cloudinary upload preset
    formData.append("cloud_name", "dhphr9vte"); // Replace with your Cloudinary cloud name

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dhphr9vte/image/upload`, // Replace YOUR_CLOUD_NAME
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const handlePost = async () => {
    if (!session) {
      setShowSignin(true);
      return;
    }

    try {
      setLoading(true);
      
      let imageUrl = null;
      if (imageFile) {
        setUploadingImage(true);
        imageUrl = await uploadToCloudinary(imageFile);
        setUploadingImage(false);
      }

      const res = await createPost(post, imageUrl ?? undefined);
      if (res.success) {
        setPost("");
        handleRemoveImage();
        toast("Post Created");
        onPostCreated();
      } else {
        toast("Error in creating post");
      }
    } catch (error) {
      console.log(error);
      toast("Error in creating post");
    } finally {
      setLoading(false);
      setUploadingImage(false);
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
          ref={textareaRef}
          placeholder="What's happening?"
          rows={3}
          value={post}
          onChange={(e) => setPost(e.target.value)}
          className="w-full pb-2 outline-none resize-none overflow-hidden placeholder:text-neutral-600 text-lg text-white border-b border-neutral-800 bg-transparent"
        />

        {imagePreview && (
          <div className="mt-4 mb-2 relative inline-block">
            <div className=" rounded-xl overflow-hidden border border-neutral-700">
              <Image
                src={imagePreview}
                alt="Preview"
                width={70}
                height={70}
                className="object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-gray-500/80 hover:bg-gray-700 rounded-full p-1.5 transition-colors"
              >
                <IoClose size={10} className="text-white" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center w-full justify-between gap-x-6">
          <div className="flex items-center w-full gap-x-3 relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <span 
              onClick={handleImageClick}
              className="hover:bg-white/10 p-2 rounded-full cursor-pointer"
            >
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
            disabled={post.trim().length < 1 || loading || uploadingImage}
            className="text-[14px] font-bold px-4 py-2 rounded-md cursor-pointer transition-all
              bg-white text-black 
              disabled:bg-neutral-500/50 disabled:text-neutral-200 disabled:cursor-not-allowed"
          >
            {loading || uploadingImage ? (
              <AiOutlineLoading3Quarters size={20} className="animate-spin" />
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowImageModal(false)}
        >
          <div 
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-[4px_4px_4px_rgba(0,0,0,0.1),-4px_-4px_4px_rgba(0,0,0,0.08)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">Upload Image</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-neutral-700 hover:border-neutral-600 rounded-xl p-8 transition-colors flex flex-col items-center gap-3 cursor-pointer"
              >
                <BsFillImageFill size={40} className="text-neutral-500" />
                <div className="text-center">
                  <p className="text-white font-medium">Choose an image</p>
                  <p className="text-neutral-500 text-sm mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </button>

              <button
                onClick={() => setShowImageModal(false)}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <SignupModal
        open={showSignin}
        onClose={() => setShowSignin(false)}
        onSignup={handleSignup}
      />
    </>
  );
};

export default CreatePost;