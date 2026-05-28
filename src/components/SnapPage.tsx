"use client";

import React from "react";
import { useSectionSnap, SNAP_CONFIG } from "@/hooks/useSectionSnap";

/**
 * SnapPage
 * ─────────
 * Wraps the entire page in a full-viewport scroll-snap container.
 * Any direct or nested element with [data-snap-section] becomes a snap target
 * and receives the premium focus / dim treatment on scroll.
 *
 * Usage:
 *   <SnapPage>
 *     <section data-snap-section> … </section>
 *     <section data-snap-section> … </section>
 *   </SnapPage>
 */
export default function SnapPage({ children }: { children: React.ReactNode }) {
  const containerRef = useSectionSnap();

  return (
    <>
      <style>{`
        /* ── Snap container ── */
        .snap-page-container {
          height: 100svh;
          overflow-y: scroll;
          overflow-x: hidden;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
          /* Hide scrollbar for a cleaner look */
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .snap-page-container::-webkit-scrollbar { display: none; }

        /* ── Each snap section ── */
        [data-snap-section] {
          scroll-snap-align: ${SNAP_CONFIG.snapAlign};
          /* Will-change for GPU compositing */
          will-change: opacity, transform, filter;
        }
      `}</style>

      <div ref={containerRef} className="snap-page-container">
        {children}
      </div>
    </>
  );
}