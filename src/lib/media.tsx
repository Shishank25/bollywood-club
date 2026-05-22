"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// 1. Upgraded Type: We need optional fields for the low-res/thumbnail versions.
export type MediaAsset = {
  html_id: string;
  media_url: string; // The high-res image OR the main video file
  media_type: 'image' | 'video';
  alt_text: string | null;
  width: number | null;
  height: number | null;
  thumbnail_url?: string; // NEW: For video thumbnails
  low_res_url?: string;   // NEW: For compressed images
};

export default function MediaSlot({ 
  id, 
  mediaMap, 
  className = "" 
}: { 
  id: string; 
  mediaMap: Record<string, MediaAsset>; 
  className?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // Needed for Next.js SSR with Portals
  const asset = mediaMap[id];

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Esc key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Fallback while loading or if empty
  if (!asset) {
    return <div className={`animate-pulse bg-brand-border/20 ${className}`} />;
  }

  // Helper to close modal without triggering parent clicks
  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsModalOpen(false);
  };

  // The actual modal content that will be Portaled to the document body
  const modalContent = isModalOpen ? (
    <div 
      // Changed from inset-0 to top-[88px] bottom-0 left-0 right-0 to stay below the header. 
      // If your header is a different height, adjust the 88px!
      className="fixed top-[88px] inset-x-0 bottom-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-300"
      onClick={handleClose} 
    >
      {/* Close Button */}
      <button 
        onClick={handleClose}
        className="absolute top-6 right-6 sm:top-10 sm:right-10 text-white/70 hover:text-white transition-colors z-[10000]"
      >
        <i className="fa-solid fa-xmark text-4xl" />
      </button>

      {/* Media Container */}
      <div 
        className="relative max-w-full max-h-full flex items-center justify-center animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()} 
      >
        {asset.media_type === 'video' ? (
          <video
            controls
            autoPlay
            className="max-w-[95vw] max-h-[80vh] rounded-lg shadow-2xl outline-none"
            src={asset.media_url} 
          />
        ) : (
          <img
            src={asset.media_url}
            alt={asset.alt_text || "Expanded Media"}
            className="max-w-[95vw] max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* ── Base Media Slot (Clickable) ── */}
      <div 
        className={`relative cursor-pointer group ${className}`}
        onClick={() => setIsModalOpen(true)}
      >
        {asset.media_type === 'video' ? (
          <>
            {/* Show video thumbnail */}
            <img
              src={asset.thumbnail_url || asset.media_url} 
              alt={asset.alt_text || "Video Thumbnail"}
              className="w-full h-full object-cover"
              width={asset.width || undefined}
              height={asset.height || undefined}
            />
            {/* Play Button Indicator */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-300">
              <div className="w-16 h-16 rounded-full border border-white/50 backdrop-blur-sm flex items-center justify-center text-white bg-white/10 group-hover:bg-white group-hover:text-brand-black transition-all duration-300">
                <i className="fa-solid fa-play ml-1 text-xl" />
              </div>
            </div>
          </>
        ) : (
          /* Show low-res image */
          <img
            src={asset.low_res_url || asset.media_url} 
            alt={asset.alt_text || "Media Content"}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
            width={asset.width || undefined}
            height={asset.height || undefined}
          />
        )}
      </div>

      {/* ── Modal Overlay via Portal ── */}
      {/* Portals wait until the component is mounted on the client to avoid SSR hydration errors */}
      {mounted && modalContent ? createPortal(modalContent, document.body) : null}
    </>
  );
}