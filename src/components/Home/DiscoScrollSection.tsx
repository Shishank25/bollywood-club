import React, { useRef, useEffect } from 'react';

const ScrollDiscoVideo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);

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

      // --- DISCO BALL CONFIGURATION ---
      const FINAL_X = -15; 
      const TRAVEL = 20; 
      const MAX_OPACITY = 0.8;
      
      const START_X = FINAL_X - TRAVEL; 
      // --------------------------------

      let translateX = 0;
      let opacity = 0;

      if (scrollY < enterStart) {
        translateX = START_X;
        opacity = 0;
      } else if (scrollY >= enterStart && scrollY < enterEnd) {
        const entryProgress = (scrollY - enterStart) / (enterEnd - enterStart);
        translateX = START_X + (entryProgress * TRAVEL);
        opacity = entryProgress * MAX_OPACITY - 0.1; 
      } else if (scrollY >= enterEnd && scrollY <= exitStart) {
        translateX = FINAL_X;
        opacity = MAX_OPACITY;
      } else if (scrollY > exitStart && scrollY <= exitEnd) {
        const exitProgress = (scrollY - exitStart) / (exitEnd - exitStart);
        translateX = FINAL_X - (exitProgress * TRAVEL);
        opacity = MAX_OPACITY - (exitProgress * MAX_OPACITY); 
      } else {
        translateX = START_X;
        opacity = 0;
      }

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // --- DISCO BALL ANIMATION (Untouched) ---
        seekVideo(progress);
        video.style.transform = `translateX(${translateX}%) rotate(-10deg)`;
        video.style.opacity = opacity.toString();

        // --- TEXT ANIMATION ---
        const updateText = (el: HTMLElement | null, blockIndex: number) => {
          if (!el) return;
          
          const blockTop = containerTop + (blockIndex * windowHeight);
          const totalScrollDistance = windowHeight * 2; 
          const currentScroll = scrollY + windowHeight - blockTop;
          
          // Progress of this specific text block from 0 (just entered screen) to 1 (just left screen)
          const p = currentScroll / totalScrollDistance;

          // --- TEXT FADE CONFIGURATION ---
          // Use decimals between 0.0 and 1.0 to control the timeline
          const FADE_IN_START = 0.2;   // Starts appearing at 20% of its scroll journey
          const FADE_IN_END = 0.35;    // Fully visible by 35%
          const FADE_OUT_START = 0.65; // Starts disappearing at 65%
          const FADE_OUT_END = 0.8;    // Fully gone by 80%
          const MAX_TEXT_OPACITY = 0.6; // The peak opacity (0.6 = 60% visible)
          // -------------------------------

          let textOpacity = 0;

          if (p < FADE_IN_START) {
            // Before it starts fading in
            textOpacity = 0;
          } else if (p >= FADE_IN_START && p <= FADE_IN_END) {
            // Fading in
            const fadeProgress = (p - FADE_IN_START) / (FADE_IN_END - FADE_IN_START);
            textOpacity = fadeProgress * MAX_TEXT_OPACITY;
          } else if (p > FADE_IN_END && p < FADE_OUT_START) {
            // Holding at max visibility
            textOpacity = MAX_TEXT_OPACITY;
          } else if (p >= FADE_OUT_START && p <= FADE_OUT_END) {
            // Fading out
            const fadeProgress = (p - FADE_OUT_START) / (FADE_OUT_END - FADE_OUT_START);
            textOpacity = MAX_TEXT_OPACITY - (fadeProgress * MAX_TEXT_OPACITY);
          } else {
            // After it has fully faded out
            textOpacity = 0;
          }

          el.style.opacity = textOpacity.toFixed(3);
          // Removed the translateX transform entirely so it stays locked in place
          el.style.transform = `none`;
        };

        updateText(text1Ref.current, 0); 
        updateText(text2Ref.current, 1); 
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
      // Re-added overflow-x-clip to safely contain the overflowing blobs 
      // without affecting the horizontal width of the screen.
      className="relative w-full h-[200vh] text-white block md:hidden overflow-x-clip"
      style={{ backgroundColor: '#10080600' }}
    >
      {/* Inline styles for the slow floating animation */}
      <style>{`
        @keyframes float-blob-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(40px, 60px) scale(1.1); }
        }
        @keyframes float-blob-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-50px, 30px) scale(0.9); }
        }
      `}</style>

      {/* 1. Sticky Background Container */}
      <div className="sticky top-0 w-full h-[100dvh] overflow-hidden flex flex-col justify-center items-center">
        
        {/* --- NEW: Floating Ambient Blobs --- */}
        <div className="absolute inset-0 pointer-events-none z-[-1]">
          {/* Top Left Blob */}
          {/* <div 
            className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] rounded-full blur-[60px] opacity-70"
            style={{ 
              backgroundColor: '#2a120e', // Slightly lighter/warmer than #100806
              animation: 'float-blob-1 14s ease-in-out infinite' 
            }} 
          /> */}
          {/* Bottom Right Blob */}
          {/* <div 
            className="absolute bottom-[-10%] right-[-20%] w-[80vw] h-[80vw] rounded-full blur-[70px] opacity-60"
            style={{ 
              backgroundColor: '#1a100d', // Another subtle dark variation
              animation: 'float-blob-2 18s ease-in-out infinite' 
            }} 
          /> */}
        </div>
        {/* ---------------------------------- */}

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
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">

        {/* First Text Block */}
        <div className="h-[100vh] flex items-center justify-end pr-8">
          <h2 
            ref={text1Ref} 
            className="font-sans font-medium tracking-wide text-3xl text-right text-white max-w-[58%] leading-snug opacity-0"
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.9)' }}
          >
            The vibe is dialed up. <br />
            The laughs are flowing. <br />
            Get in here.
          </h2>
        </div>

        {/* Second Text Block */}
        <div className="h-[100vh] flex items-center justify-end pr-8">
          <h2 
            ref={text2Ref} 
            className="font-sans font-medium tracking-wide text-3xl text-right text-white max-w-[58%] leading-snug opacity-0"
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.9)' }}
          >
            They'll talk about this.<br />
            Make sure you're<br />
            in the room.
          </h2>
        </div>

      </div>
    </section>
  );
};

export default ScrollDiscoVideo;