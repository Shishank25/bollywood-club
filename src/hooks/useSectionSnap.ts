"use client";

import { useEffect, useRef, useCallback } from "react";

// ─── Configuration ────────────────────────────────────────────────────────────
// Edit these values to tune the snap/focus behaviour globally.

export const SNAP_CONFIG = {
  // CSS transition applied to every snap section
  transition: "opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1), filter 0.65s cubic-bezier(0.16,1,0.3,1)",

  // Active (in-focus) state
  active: {
    opacity: "1",
    transform: "scale(1) translateZ(0)",
    filter: "blur(0px) brightness(1)",
    zIndex: "2",
  },

  // Inactive (out-of-focus) state
  inactive: {
    opacity: "0.32",
    transform: "scale(0.975) translateZ(0)",
    filter: "blur(1.5px) brightness(0.7)",
    zIndex: "1",
  },

  // IntersectionObserver threshold — how much of a section must be visible
  // before it's considered "active". 0.45 means 45%.
  threshold: 0.45,

  // Extra margin so snapping kicks in slightly before the element edge.
  rootMargin: "0px 0px 0px 0px",

  // Scroll snap alignment for the container CSS
  snapAlign: "start" as "start" | "center",

  // Whether to disable the focus-dimming on mobile (< 768 px).
  // Snapping still works; only the dim/scale effect is toggled.
  disableFocusOnMobile: false,
} as const;

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Attach to a scroll container.  Every child with [data-snap-section]
 * will receive the focus/dim treatment as the user scrolls.
 */
export function useSectionSnap() {
  const containerRef = useRef<HTMLDivElement>(null);

  const applyStyles = useCallback((el: HTMLElement, active: boolean) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile && SNAP_CONFIG.disableFocusOnMobile) return;

    const styles = active ? SNAP_CONFIG.active : SNAP_CONFIG.inactive;
    el.style.transition = SNAP_CONFIG.transition;
    Object.assign(el.style, styles);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>("[data-snap-section]")
    );

    if (sections.length === 0) return;

    // Initialise all as inactive except the first
    sections.forEach((s, i) => applyStyles(s, i === 0));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          applyStyles(entry.target as HTMLElement, entry.isIntersecting);
        });
      },
      {
        root: container,
        threshold: SNAP_CONFIG.threshold,
        rootMargin: SNAP_CONFIG.rootMargin,
      }
    );

    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, [applyStyles]);

  return containerRef;
}