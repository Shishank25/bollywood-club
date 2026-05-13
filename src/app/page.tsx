"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MediaAsset } from "@/lib/media"; // Adjust this path if you saved your types elsewhere
import MediaSlot from "@/lib/media"; // Adjust this path based on where you saved the component

export default function HomePage() {
  const [media, setMedia] = useState<Record<string, MediaAsset>>({});
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Media from your GET Route
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch('/api/media?page=/home');
        if (res.ok) {
          const data = await res.json();
          setMedia(data);
        }
      } catch (error) {
        console.error("Failed to fetch media:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, []);

  // 2. Scroll reveal animations (Re-runs when loading state changes)
  useEffect(() => {
    if (isLoading) return; // Wait for dynamic content to mount before observing

    // Image reveal on load
    const reveals = document.querySelectorAll(".img-reveal");
    const timer = setTimeout(() => {
      reveals.forEach((r) => r.classList.add("active"));
    }, 100);

    // Intersection observer for fade-up elements
    const fadeElements = document.querySelectorAll(".fade-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    
    fadeElements.forEach((el) => observer.observe(el));

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isLoading]);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[100svh] w-full flex flex-col justify-end px-6 md:px-12 pb-12 pt-32">
        <div className="absolute inset-0 top-[88px] bottom-6 left-6 right-6 rounded-[2rem] overflow-hidden bg-brand-offwhite img-reveal -z-10">
          
          {/* REFACTORED: MediaSlot completely handles loading, video vs image, and dimensions */}
          <MediaSlot 
            id="hero-video" 
            mediaMap={media} 
            className="w-full h-full object-cover opacity-90 mix-blend-multiply grayscale-[10%]" 
          />

          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-end gap-10 fade-up">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl lg:text-[6vw] font-display font-extrabold tracking-tighter leading-[0.9] text-brand-black uppercase mb-6">
              Elevate Your<br />
              <span className="text-outline">Nightlife</span><br />
              Experience.
            </h1>
            <p className="text-sm md:text-base font-semibold tracking-[0.2em] uppercase text-brand-black/80">
              Curating Premium Bollywood Experiences Worldwide.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              href="/vip"
              className="btn-outline px-10 py-4 rounded-full text-xs font-bold tracking-[0.15em] uppercase w-full sm:w-auto text-center"
            >
              <span>VIP Access</span>
            </Link>
            <Link
              href="#events"
              className="btn-monumental px-10 py-4 rounded-full text-xs font-bold tracking-[0.15em] uppercase w-full sm:w-auto text-center"
            >
              <span>Reserve Tickets</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section id="events" className="pt-24 pb-32 bg-brand-white px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-end mb-16 fade-up">
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase">
              Upcoming Events
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 border-t border-brand-border pt-10">
            {[
              {
                title: "P-POP Weekender",
                city: "Melbourne",
                venue: "Crown L3 Nightclub",
                img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop",
                delay: "0ms",
              },
              {
                title: "Gulabo Welcome",
                city: "Sydney",
                venue: "The Ivy Precinct",
                img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
                delay: "100ms",
              },
              {
                title: "Desi House",
                city: "Singapore",
                venue: "Marquee Marina Bay",
                img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop",
                delay: "200ms",
              },
              {
                title: "The Grand Shaadi",
                city: "Brisbane",
                venue: "The Met",
                img: "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=800&auto=format&fit=crop",
                delay: "300ms",
              },
            ].map((event) => (
              <div
                key={event.title}
                className="group flex flex-col fade-up scale-hover"
                style={{ transitionDelay: event.delay }}
              >
                <div className="w-full aspect-[3/4] overflow-hidden bg-brand-offwhite mb-6">
                  <img
                    src={event.img}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                    alt={`${event.title} flyer`}
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="text-2xl font-display font-bold uppercase tracking-tighter mb-1 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-xs font-bold tracking-[0.15em] uppercase text-brand-gray mb-4">
                    {event.city}
                  </p>
                  <p className="text-sm font-medium text-brand-black mb-6 flex-1">
                    {event.venue}
                  </p>
                  <Link
                    href="#"
                    className="btn-outline w-full py-3 rounded-full text-xs font-bold tracking-[0.15em] uppercase text-center"
                  >
                    Reserve Tickets
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cinematic Highlights ── */}
      <section className="py-24 bg-brand-black text-white px-6 md:px-12 overflow-hidden">
        <div className="max-w-[1600px] mx-auto fade-up">
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter uppercase mb-12">
            Cinematic Highlights
          </h2>
        </div>

        <div className="max-w-[1600px] mx-auto flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scroll fade-up">
          {/* REFACTORED: Map over your database IDs instead of hardcoded URLs */}
          {['cinematic-1', 'cinematic-2'].map((id) => (
            <div
              key={id}
              className="snap-center shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] aspect-video relative group cursor-pointer overflow-hidden bg-brand-offwhite/10"
            >
              <MediaSlot 
                id={id} 
                mediaMap={media} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-white/50 backdrop-blur-sm flex items-center justify-center group-hover:bg-white group-hover:text-brand-black transition-all duration-300">
                  <i className="fa-solid fa-play ml-1 text-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Redefining Luxury ── */}
      <section className="py-32 bg-brand-white px-6 md:px-12 border-b border-brand-border">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          <div className="lg:col-span-5 fade-up">
            <div className="sticky top-32">
              <h2 className="text-5xl md:text-7xl font-display font-extrabold tracking-tighter uppercase leading-[0.9] text-brand-black mb-6">
                Redefining<br />
                <span className="text-outline">Luxury</span>
              </h2>
              <p className="text-sm font-bold tracking-[0.2em] uppercase text-brand-gray mb-10">
                The definitive Southeast Asian experience, reimagined globally.
              </p>
            </div>
          </div>

          <div
            className="lg:col-span-6 lg:col-start-7 flex flex-col gap-12 fade-up"
            style={{ transitionDelay: "200ms" }}
          >
            {[
              {
                heading: "The Phenomenon",
                body: "Step into the premier world of Bollywood Club—the ultimate destination for luxury Bollywood nightlife. We are more than a party destination; we are a cultural phenomenon bringing the vibrant heartbeat of South Asia to elite venues across Australia, New Zealand, and Singapore. Prepare to elevate your evening with an unparalleled fusion of sophisticated aesthetics, premium hospitality, and electrifying energy.",
              },
              {
                heading: "The Rhythm",
                body: "Every event at Bollywood Club is meticulously curated to transform the dance floor into a canvas of rhythm and culture. Our signature nights across major metropolitan hubs have achieved legendary status, seamlessly blending authentic Indian vibrancy with the high-octane atmosphere of elite global nightlife. Experience the rhythm as our resident and international guest DJs spin exclusive mixes, keeping the energy at its absolute peak until dawn.",
              },
            ].map((section) => (
              <div key={section.heading}>
                <h3 className="text-2xl font-display font-bold uppercase tracking-tighter mb-4 border-b border-brand-border pb-4">
                  {section.heading}
                </h3>
                <p className="text-base text-brand-gray leading-relaxed font-medium">{section.body}</p>
              </div>
            ))}

            <div>
              <h3 className="text-2xl font-display font-bold uppercase tracking-tighter mb-4 border-b border-brand-border pb-4">
                The Spectacle
              </h3>
              <p className="text-base text-brand-gray leading-relaxed font-medium mb-4">
                Our distinction lies in the immersive experiences we craft. Beyond the music, Bollywood Club delivers a visual spectacle featuring captivating live performances, state-of-the-art production, and bespoke VIP services. It is an elevated sensory journey designed for the discerning individual.
              </p>
              <p className="text-base text-brand-gray leading-relaxed font-medium">
                Join us at iconic global venues where the cinematic glamour of Bollywood meets the sophistication of premier entertainment destinations. Secure your access and become part of an exclusive community—your vibrant home away from home.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-brand-border">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-gray/60 text-justify leading-relaxed">
                Bollywood Club™ is a registered trademark proudly owned and operated by Louder World Pty. Ltd. We are committed to delivering an unparalleled and authentic nightlife experience. Our brand stands for exclusivity and excellence; any unauthorized reproduction or imitation of our properties is strictly prohibited. Your journey into the heart of luxury entertainment begins here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Join the Inner Circle (Subscribe) ── */}
      <section className="py-0 flex flex-col lg:flex-row bg-brand-white border-b border-brand-border">
        <div className="w-full lg:w-1/2 aspect-square lg:aspect-auto relative img-reveal">
          <img
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop"
            className="w-full h-full object-cover filter grayscale-[20%]"
            alt="Subscribe"
          />
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-12 lg:p-24 fade-up">
          <div className="w-full max-w-md">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter uppercase text-brand-black mb-4">
              Join the Inner Circle
            </h2>
            <p className="text-brand-gray font-medium text-sm mb-12">
              Receive priority access to ticket drops, exclusive VIP offers, and secret venue reveals delivered directly to your inbox.
            </p>

            <form className="flex flex-col gap-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="border-b border-brand-black pb-2">
                  <input
                    type="text"
                    placeholder="FIRST NAME"
                    className="w-full bg-transparent text-xs font-bold tracking-[0.15em] uppercase placeholder-brand-gray focus:outline-none"
                    required
                  />
                </div>
                <div className="border-b border-brand-black pb-2">
                  <input
                    type="text"
                    placeholder="LAST NAME"
                    className="w-full bg-transparent text-xs font-bold tracking-[0.15em] uppercase placeholder-brand-gray focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="border-b border-brand-black pb-2">
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="w-full bg-transparent text-xs font-bold tracking-[0.15em] uppercase placeholder-brand-gray focus:outline-none"
                  required
                />
              </div>

              <div className="border-b border-brand-black pb-2 flex items-center gap-4">
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-brand-black">+61</span>
                <input
                  type="tel"
                  placeholder="PHONE NO."
                  className="w-full bg-transparent text-xs font-bold tracking-[0.15em] uppercase placeholder-brand-gray focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-monumental w-full py-5 text-xs font-bold tracking-[0.15em] uppercase mt-4"
              >
                <span>Subscribe</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}