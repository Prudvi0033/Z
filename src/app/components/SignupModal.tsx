"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Space_Grotesk } from "next/font/google";
import { FcGoogle } from "react-icons/fc";
const inter = Space_Grotesk({ subsets: ["latin"] });

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
  onSignup: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({
  open,
  onClose,
  onSignup,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            className={`fixed z-[1000] top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-neutral-900/90 text-white rounded-lg shadow-2xl border border-neutral-700 p-8 flex flex-col items-center ${inter.className}`}
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-2xl font-semibold mb-2">Sign in required</h2>
            <p className="text-neutral-400 text-center mb-6">
              You need to sign in to access this page.
            </p>

            <button
              onClick={onSignup}
              className="w-full flex items-center justify-center gap-x-2 py-3 bg-white text-black rounded-xl font-semibold hover:bg-neutral-200 transition-all duration-200"
            >
              <FcGoogle size={20} />Continue with Google
            </button>

            <button
              onClick={onClose}
              className="mt-4 text-sm text-neutral-400 hover:text-neutral-200 transition"
            >
              Cancel
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
