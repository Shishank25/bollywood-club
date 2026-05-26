import React, { useRef, useEffect } from 'react';

const ScrollDiscoVideo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    video.pause();
    video.currentTime = 0;

    let rafId: number;
    let lastSeek = 0;
    const SEEK_INTERVAL = 50; 

    const seekVideo = (progress: number) => {
      if (!video.duration) return;
      const clamped = ((progress % 1) + 1) % 1;
      const now = performance.now();
      if (now - lastSeek > SEEK_INTERVAL) {
        video.currentTime = clamped * video.duration;
        lastSeek = now;
      }
    };

    const PIXELS_PER_LOOP = 500;

    const onScroll = () => {
      const progress = ((window.scrollY / PIXELS_PER_LOOP) % 1 + 1) % 1;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;

      const transitionDistance = windowHeight * 1.5; 

      const enterStart = containerTop - windowHeight;
      const enterEnd = enterStart + transitionDistance;
      const exitEnd = containerTop + containerHeight;
      const exitStart = exitEnd - transitionDistance;

      // --- CONFIGURATION ---
      const FINAL_X = -15;    // The resting position when fully in view (negative = further left)
      const TRAVEL = 20;      // How much it moves during the slide (e.g., 20% travel)
      const MAX_OPACITY = 0.8;
      
      // Calculate where it should start based on the final position and travel distance
      const START_X = FINAL_X - TRAVEL; 
      // ---------------------

      let translateX = 0;
      let opacity = 0;

      if (scrollY < enterStart) {
        // Before section is in view
        translateX = START_X;
        opacity = 0;
      } else if (scrollY >= enterStart && scrollY < enterEnd) {
        // Entering viewport
        const entryProgress = (scrollY - enterStart) / (enterEnd - enterStart);
        translateX = START_X + (entryProgress * TRAVEL);
        opacity = entryProgress * MAX_OPACITY; 
      } else if (scrollY >= enterEnd && scrollY <= exitStart) {
        // Sticky phase - resting at the new leftward position
        translateX = FINAL_X;
        opacity = MAX_OPACITY;
      } else if (scrollY > exitStart && scrollY <= exitEnd) {
        // Exiting viewport
        const exitProgress = (scrollY - exitStart) / (exitEnd - exitStart);
        translateX = FINAL_X - (exitProgress * TRAVEL);
        opacity = MAX_OPACITY - (exitProgress * MAX_OPACITY); 
      } else {
        // Past the section entirely
        translateX = START_X;
        opacity = 0;
      }

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        seekVideo(progress);
        video.style.transform = `translateX(${translateX}%) rotate(-10deg)`;
        video.style.opacity = opacity.toString();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="disco-scroll"
      ref={containerRef}
      className="relative w-full h-[400vh] bg-black text-white block md:hidden"
    >
      {/* 1. Sticky Background (Disco Ball) */}
      <div className="sticky top-0 w-full h-[100dvh] overflow-hidden flex flex-col justify-center items-center">
        <video
          ref={videoRef}
          className="absolute top-0 -left-28 w-full h-full object-contain z-0 pointer-events-none"
          src="/disco_ball.webm"
          muted
          playsInline
          preload="auto"
        />
      </div>

      {/* 2. Scrolling Text Overlay */}
      {/* This sits on top of the sticky video and scrolls normally */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        
        {/* First Text Block - appears after the initial slide-in */}
        <div className="h-[100vh] flex items-center justify-end pr-8">
          <h2 className="font-serif italic tracking-wider text-3xl text-right drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-white/90 max-w-[60%]">
            Lorem ipsum dolor sit amet, 
          </h2>
        </div>

        {/* Second Text Block - halfway through the scroll */}
        <div className="h-[100vh] flex items-center justify-end pr-8">
          <h2 className="font-serif italic tracking-wider text-3xl text-right drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-white/90 max-w-[60%]">
            consectetur adipiscing elit. 
          </h2>
        </div>

        {/* Third Text Block - right before the exit phase */}
        <div className="h-[100vh] flex items-center justify-end pr-8">
          <h2 className="font-serif italic tracking-wider text-3xl text-right drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-white/90 max-w-[60%]">
            Dance until the sun comes up.
          </h2>
        </div>

      </div>
    </section>
  );
};

export default ScrollDiscoVideo;