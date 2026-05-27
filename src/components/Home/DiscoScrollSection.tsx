import React, { useRef, useEffect } from 'react';

const ScrollDiscoVideo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);

//   useEffect(() => {
//     const video = videoRef.current;
//     const container = containerRef.current;
//     if (!video || !container) return;

//     video.pause();
//     video.currentTime = 0;

//     let rafId: number;
//     let lastSeek = 0;
//     const SEEK_INTERVAL = 50; 

//     const seekVideo = (progress: number) => {
//       if (!video.duration) return;
//       const clamped = ((progress % 1) + 1) % 1;
//       const now = performance.now();
//       if (now - lastSeek > SEEK_INTERVAL) {
//         video.currentTime = clamped * video.duration;
//         lastSeek = now;
//       }
//     };

//     const PIXELS_PER_LOOP = 500;

//     const onScroll = () => {
//       const progress = ((window.scrollY / PIXELS_PER_LOOP) % 1 + 1) % 1;

//       const scrollY = window.scrollY;
//       const windowHeight = window.innerHeight;
//       const containerTop = container.offsetTop;
//       const containerHeight = container.offsetHeight;

//       const transitionDistance = windowHeight * 1.5; 

//       const enterStart = containerTop - windowHeight;
//       const enterEnd = enterStart + transitionDistance;
//       const exitEnd = containerTop + containerHeight;
//       const exitStart = exitEnd - transitionDistance;

//       // --- DISCO BALL CONFIGURATION ---
//       const FINAL_X = -15; 
//       const TRAVEL = 20; 
//       const MAX_OPACITY = 0.8;
      
//       const START_X = FINAL_X - TRAVEL; 
//       // --------------------------------

//       let translateX = 0;
//       let opacity = 0;

//       if (scrollY < enterStart) {
//         translateX = START_X;
//         opacity = 0;
//       } else if (scrollY >= enterStart && scrollY < enterEnd) {
//         const entryProgress = (scrollY - enterStart) / (enterEnd - enterStart);
//         translateX = START_X + (entryProgress * TRAVEL);
//         opacity = entryProgress * MAX_OPACITY - 0.1; 
//       } else if (scrollY >= enterEnd && scrollY <= exitStart) {
//         translateX = FINAL_X;
//         opacity = MAX_OPACITY;
//       } else if (scrollY > exitStart && scrollY <= exitEnd) {
//         const exitProgress = (scrollY - exitStart) / (exitEnd - exitStart);
//         translateX = FINAL_X - (exitProgress * TRAVEL);
//         opacity = MAX_OPACITY - (exitProgress * MAX_OPACITY); 
//       } else {
//         translateX = START_X;
//         opacity = 0;
//       }

//       cancelAnimationFrame(rafId);
//       rafId = requestAnimationFrame(() => {
//         // --- DISCO BALL ANIMATION (Untouched) ---
//         seekVideo(progress);
//         video.style.transform = `translateX(${translateX}%) rotate(-10deg)`;
//         video.style.opacity = opacity.toString();

//         // --- TEXT ANIMATION ---
//         const updateText = (el: HTMLElement | null, blockIndex: number) => {
//           if (!el) return;
          
//           const blockTop = containerTop + (blockIndex * windowHeight);
//           const totalScrollDistance = windowHeight * 2; 
//           const currentScroll = scrollY + windowHeight - blockTop;
          
//           // Progress of this specific text block from 0 (just entered screen) to 1 (just left screen)
//           const p = currentScroll / totalScrollDistance;

//           // --- TEXT FADE CONFIGURATION ---
//           // Use decimals between 0.0 and 1.0 to control the timeline
//           const FADE_IN_START = 0.2;   // Starts appearing at 20% of its scroll journey
//           const FADE_IN_END = 0.35;    // Fully visible by 35%
//           const FADE_OUT_START = 0.65; // Starts disappearing at 65%
//           const FADE_OUT_END = 0.8;    // Fully gone by 80%
//           const MAX_TEXT_OPACITY = 0.6; // The peak opacity (0.6 = 60% visible)
//           // -------------------------------

//           let textOpacity = 0;

//           if (p < FADE_IN_START) {
//             // Before it starts fading in
//             textOpacity = 0;
//           } else if (p >= FADE_IN_START && p <= FADE_IN_END) {
//             // Fading in
//             const fadeProgress = (p - FADE_IN_START) / (FADE_IN_END - FADE_IN_START);
//             textOpacity = fadeProgress * MAX_TEXT_OPACITY;
//           } else if (p > FADE_IN_END && p < FADE_OUT_START) {
//             // Holding at max visibility
//             textOpacity = MAX_TEXT_OPACITY;
//           } else if (p >= FADE_OUT_START && p <= FADE_OUT_END) {
//             // Fading out
//             const fadeProgress = (p - FADE_OUT_START) / (FADE_OUT_END - FADE_OUT_START);
//             textOpacity = MAX_TEXT_OPACITY - (fadeProgress * MAX_TEXT_OPACITY);
//           } else {
//             // After it has fully faded out
//             textOpacity = 0;
//           }

//           el.style.opacity = textOpacity.toFixed(3);
//           // Removed the translateX transform entirely so it stays locked in place
//           el.style.transform = `none`;
//         };

//         const COLOR_TRANSITION_DISTANCE = 600;

//         const colorStart = containerTop - COLOR_TRANSITION_DISTANCE;
//         const colorEnd = containerTop;

//         const rawColorProgress =
//             (scrollY - colorStart) / (colorEnd - colorStart);

//         const t = Math.min(Math.max(rawColorProgress, 0), 1);

//         // Smoothstep easing
//         const colorProgress = t * t * (3 - 2 * t);

//         // --- TEXT COLOR INTERPOLATION ---
//         // Starts near-black (invisible on white bg), transitions to white as bg darkens
//         const TEXT_FROM = { r: 16,  g: 8,   b: 6   }; // matches #100806 — invisible on dark, dark on white
//         const TEXT_TO   = { r: 255, g: 255, b: 255 }; // pure white

//         const tr = Math.round(
//             TEXT_FROM.r +
//             (TEXT_TO.r - TEXT_FROM.r) * colorProgress
//         );

//         const tg = Math.round(
//             TEXT_FROM.g +
//             (TEXT_TO.g - TEXT_FROM.g) * colorProgress
//         );

//         const tb = Math.round(
//             TEXT_FROM.b +
//             (TEXT_TO.b - TEXT_FROM.b) * colorProgress
//         );

//         const textColor = `rgb(${tr},${tg},${tb})`;

//         // --- APPLY TEXT COLOR ---
//         if (text1Ref.current) {
//             text1Ref.current.style.color = textColor;
//         }

//         if (text2Ref.current) {
//             text2Ref.current.style.color = textColor;
//         }

//         updateText(text1Ref.current, 0); 
//         updateText(text2Ref.current, 1); 
//       });
//     };

//     window.addEventListener('scroll', onScroll, { passive: true });
//     onScroll();

//     return () => {
//       window.removeEventListener('scroll', onScroll);
//       cancelAnimationFrame(rafId);
//     };
//   }, []);

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
          
          const p = currentScroll / totalScrollDistance;

          // --- TEXT FADE CONFIGURATION ---
          const FADE_IN_START = 0.2;   
          const FADE_IN_END = 0.35;    
          const FADE_OUT_START = 0.65; 
          const FADE_OUT_END = 0.8;    
          const MAX_TEXT_OPACITY = 0.6; 
          // -------------------------------

          let textOpacity = 0;

          if (p < FADE_IN_START) {
            textOpacity = 0;
          } else if (p >= FADE_IN_START && p <= FADE_IN_END) {
            const fadeProgress = (p - FADE_IN_START) / (FADE_IN_END - FADE_IN_START);
            textOpacity = fadeProgress * MAX_TEXT_OPACITY;
          } else if (p > FADE_IN_END && p < FADE_OUT_START) {
            textOpacity = MAX_TEXT_OPACITY;
          } else if (p >= FADE_OUT_START && p <= FADE_OUT_END) {
            const fadeProgress = (p - FADE_OUT_START) / (FADE_OUT_END - FADE_OUT_START);
            textOpacity = MAX_TEXT_OPACITY - (fadeProgress * MAX_TEXT_OPACITY);
          } else {
            textOpacity = 0;
          }

          // Force opacity to 1 so the fading math above is ignored for now
          el.style.opacity = '1';
          el.style.transform = `none`;
        };

        const COLOR_TRANSITION_DISTANCE = 600;

        const colorStart = containerTop - COLOR_TRANSITION_DISTANCE;
        const colorEnd = containerTop;

        const rawColorProgress =
            (scrollY - colorStart) / (colorEnd - colorStart);

        const t = Math.min(Math.max(rawColorProgress, 0), 1);

        // Smoothstep easing
        const colorProgress = t * t * (3 - 2 * t);

        // --- TEXT COLOR INTERPOLATION ---
        const TEXT_FROM = { r: 16,  g: 8,   b: 6   }; 
        const TEXT_TO   = { r: 255, g: 255, b: 255 }; 

        const tr = Math.round(
            TEXT_FROM.r +
            (TEXT_TO.r - TEXT_FROM.r) * colorProgress
        );

        const tg = Math.round(
            TEXT_FROM.g +
            (TEXT_TO.g - TEXT_FROM.g) * colorProgress
        );

        const tb = Math.round(
            TEXT_FROM.b +
            (TEXT_TO.b - TEXT_FROM.b) * colorProgress
        );

        const textColor = `rgb(${tr},${tg},${tb})`;

        // --- APPLY TEXT COLOR ---
        if (text1Ref.current) {
            text1Ref.current.style.color = textColor;
        }

        if (text2Ref.current) {
            text2Ref.current.style.color = textColor;
        }

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
      className="relative w-full h-[100vh] text-white block md:hidden overflow-x-clip"
      style={{ backgroundColor: '#10080600' }}
    >

      {/* 1. Sticky Background Container */}
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
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">

        {/* First Text Block */}
        <div className="h-[100vh] flex items-center justify-end pr-8">
          <h2 
            ref={text1Ref} 
            className="font-sans font-medium tracking-wide text-3xl text-right max-w-[58%] leading-snug opacity-100"
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.9)', color: 'rgb(16,8,6)' }}
        >
            The vibe is dialed up. <br />
            The laughs are flowing. <br />
            Get in here.
          </h2>
        </div>
      </div>
    </section>
  );
};

export default ScrollDiscoVideo;