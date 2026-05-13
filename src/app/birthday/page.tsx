"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MediaAsset } from '@/lib/media';
import MediaSlot from '@/lib/media'; // Adjust path as needed

export default function BirthdayPage() {
    // State for media fetching
    const [media, setMedia] = useState<Record<string, MediaAsset>>({});
    const [isLoading, setIsLoading] = useState(true);
    
    // State for the cinematic image reveal on load
    const [isRevealed, setIsRevealed] = useState(false);

    const features = [
        {
            id: "card-1",
            num: "01",
            title: "The VIP Experience",
            desc: "Lights, Camera, BOLLYWOOD – where every birthday is a blockbuster! Elevate your celebration. Skip the lines, dance in the VIP lounge, and enjoy top-shelf drinks.",
            delay: "0ms"
        },
        {
            id: "card-2",
            num: "02",
            title: "Hottest Beats & Glamour",
            desc: "Dance to the hottest Bollywood beats, sip on exotic cocktails, and capture the glamour with our professional in-house photographers to remember the night forever.",
            delay: "100ms"
        },
        {
            id: "card-3",
            num: "03",
            title: "Exclusive Offers",
            desc: "Book now for exclusive birthday offers and make your special day a true sensation! Limited slots are available, so grab your tickets now before they sell out.",
            delay: "200ms"
        }
    ];

    // 1. Fetch Media from your GET Route
    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const res = await fetch('/api/media?page=/birthday');
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

        // Trigger the clip-path and zoom reveal slightly after mount
        const revealTimer = setTimeout(() => setIsRevealed(true), 100);

        // Scroll Reveal Animations (Ensure .fade-up is in your globals.css)
        const fadeElements = document.querySelectorAll('.fade-up');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        fadeElements.forEach(el => observer.observe(el));

        return () => {
            clearTimeout(revealTimer);
            observer.disconnect();
        };
    }, [isLoading]);

    return (
        <main className="w-full selection:bg-brand-black selection:text-white">
            
            {/* ── HERO SECTION ── */}
            <section className="relative h-[75svh] min-h-[500px] w-full px-6 md:px-12 pt-28 pb-12 flex flex-col">
                <div 
                    className={`relative w-full h-full rounded-[2rem] overflow-hidden bg-brand-black shadow-xl transition-[clip-path] duration-[1200ms] ease-custom ${
                        isRevealed ? '[clip-path:polygon(0_0,_100%_0,_100%_100%,_0_100%)]' : '[clip-path:polygon(0_100%,_100%_100%,_100%_100%,_0_100%)]'
                    }`}
                >
                    {/* Replaced hardcoded image with MediaSlot */}
                    <MediaSlot 
                        id="hero-video" 
                        mediaMap={media} 
                        className={`absolute inset-0 w-full h-full object-cover filter grayscale-[20%] opacity-70 transition-transform duration-[8000ms] ease-out ${
                            isRevealed ? 'scale-100' : 'scale-[1.05]'
                        }`}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent"></div>
                    
                    <div className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 z-20">
                        <div className="fade-up">
                            <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-brand-white bg-brand-accent px-4 py-2 rounded-full mb-6">
                                Celebrate With Us
                            </span>
                            <h1 className="text-5xl md:text-7xl lg:text-[8vw] leading-[0.9] font-display font-extrabold uppercase tracking-tighter text-brand-white">
                                Birth<span className="text-transparent [-webkit-text-stroke:1px_#FFFFFF]">day</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TEXT INTRO SECTION ── */}
            <section className="py-20 px-6 md:px-12 bg-brand-white text-center">
                <div className="max-w-4xl mx-auto fade-up">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tighter uppercase text-brand-black mb-6 leading-[0.95]">
                        YOLO! Get Your B-Day <br />
                        <span className="text-transparent [-webkit-text-stroke:1px_#0A0A0A] text-brand-gray">Vibes On With A Friend For Free</span>
                    </h2>
                    <div className="w-16 h-[2px] bg-brand-accent mx-auto mb-8"></div>
                    <p className="text-sm md:text-base font-medium text-brand-gray leading-relaxed max-w-2xl mx-auto">
                        If your birthday falls within 14 days before or after the party date, you can enjoy <strong className="text-brand-black font-bold">1 + 1 complimentary tickets</strong>. This exclusive offer is valid if you either purchase a VIP package or have 10 or more paid tickets in your group.
                    </p>
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-black mt-8">
                        Don't miss out on this special treat.
                    </p>
                </div>
            </section>

            {/* ── BOOKING FORM SECTION ── */}
            <section className="py-12 px-6 md:px-12 bg-brand-white border-t border-brand-border">
                <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">
                    
                    {/* Image Reveal */}
                    <div 
                        className={`w-full lg:w-1/2 relative rounded-[2rem] overflow-hidden min-h-[600px] transition-[clip-path] duration-[1200ms] ease-custom ${
                            isRevealed ? '[clip-path:polygon(0_0,_100%_0,_100%_100%,_0_100%)]' : '[clip-path:polygon(0_100%,_100%_100%,_100%_100%,_0_100%)]'
                        }`}
                    >
                        {/* Replaced hardcoded image with MediaSlot */}
                        <MediaSlot 
                            id="form-media" 
                            mediaMap={media} 
                            className="absolute inset-0 w-full h-full object-cover filter grayscale-[10%]" 
                        />

                        <div className="absolute inset-0 bg-brand-black/20"></div>
                        
                        <div className="absolute bottom-12 left-12 mix-blend-difference text-brand-white z-10">
                            <h3 className="text-6xl md:text-8xl font-display font-extrabold uppercase tracking-tighter leading-none">
                                Your <br /> Special <br /> <span className="text-brand-accent">Night</span>
                            </h3>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center py-8 fade-up" style={{ transitionDelay: '200ms' }}>
                        <div className="max-w-xl w-full mx-auto lg:mx-0">
                            <h3 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-brand-black mb-2">Claim Your Offer</h3>
                            <p className="text-xs font-bold tracking-[0.15em] uppercase text-brand-gray mb-12">Register your birthday details below.</p>
                            
                            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <input type="text" placeholder="FIRST NAME *" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" />
                                    </div>
                                    <div>
                                        <input type="text" placeholder="LAST NAME *" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" />
                                    </div>
                                </div>

                                <div className="flex items-end border-b border-brand-black pb-2 transition-colors focus-within:border-brand-accent group">
                                    <div className="flex items-center gap-2 mr-4 text-xs font-bold tracking-widest text-brand-black">
                                        <span>+61</span>
                                    </div>
                                    <input type="tel" placeholder="PHONE NUMBER *" required className="w-full bg-transparent text-xs font-bold tracking-[0.15em] uppercase outline-none placeholder-brand-gray text-brand-black rounded-none" />
                                </div>

                                <div>
                                    <input type="email" placeholder="EMAIL ADDRESS *" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <input type="date" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-gray [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 transition-opacity rounded-none" />
                                    </div>
                                    <div>
                                        <input type="text" placeholder="CITY *" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" />
                                    </div>
                                </div>

                                <button type="submit" className="group relative overflow-hidden inline-flex items-center justify-center w-full py-5 text-xs font-bold tracking-[0.15em] uppercase mt-8 bg-brand-black text-white transition-colors duration-300">
                                    <div className="absolute top-full left-0 w-full h-full bg-brand-accent transition-all duration-[400ms] ease-custom z-10 group-hover:top-0"></div>
                                    <span className="relative z-20">Submit Details</span>
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── FEATURES GRID SECTION ── */}
            <section className="py-24 px-6 md:px-12 bg-brand-offwhite">
                <div className="max-w-[1600px] mx-auto">
                    
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 fade-up">
                        <div className="max-w-2xl">
                            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-brand-gray mb-4">Spice Up Your Bash</h3>
                            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase text-brand-black leading-[0.9]">
                                Make It A <br /> 
                                <span className="text-transparent [-webkit-text-stroke:1px_#0A0A0A]">Blockbuster</span>
                            </h2>
                        </div>
                        <div className="mt-6 md:mt-0 max-w-sm">
                            <p className="text-sm font-medium text-brand-gray leading-relaxed">
                                Why settle for a regular party when you can celebrate with the ultimate cinematic glamour?
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div 
                                key={i} 
                                className="bg-brand-offwhite border border-transparent p-10 flex flex-col justify-start min-h-[300px] transition-all duration-[400ms] ease-custom hover:bg-white hover:border-brand-black hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] fade-up group"
                                style={{ transitionDelay: feature.delay }}
                            >
                                {/* Added MediaSlot container inside the card */}
                                <div className="w-full h-40 mb-6 overflow-hidden rounded-lg bg-brand-border/20">
                                    <MediaSlot 
                                        id={feature.id} 
                                        mediaMap={media} 
                                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" 
                                    />
                                </div>
                                <div className="mb-4">
                                    <span className="text-5xl font-display font-extrabold text-brand-black/10 group-hover:text-brand-accent transition-colors duration-500">
                                        {feature.num}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-display font-bold uppercase tracking-tighter text-brand-black mb-3">
                                        {feature.title}
                                    </h4>
                                    <p className="text-xs text-brand-gray leading-relaxed font-medium">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* ── VIP CTA SECTION ── */}
            {/* Assuming no explicit slot was defined for this in the admin panel, keeping it hardcoded */}
            <section className="py-32 px-6 md:px-12 bg-brand-black text-brand-white relative overflow-hidden flex items-center justify-center text-center">
                <img 
                    src="https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1600&auto=format&fit=crop" 
                    className="absolute inset-0 w-full h-full object-cover opacity-30 filter grayscale-[50%]" 
                    alt="VIP Crowd"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-brand-black/40"></div>
                
                <div className="relative z-10 max-w-3xl mx-auto fade-up">
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold uppercase tracking-tighter leading-[0.9] mb-8">
                        Upgrade To <br /> 
                        <span className="text-transparent [-webkit-text-stroke:1px_#FFFFFF]">VIP Booth</span>
                    </h2>
                    <p className="text-sm md:text-base font-medium text-brand-gray mb-12 max-w-xl mx-auto leading-relaxed">
                        Book a VIP Booth Package for an exclusive seating area, a dedicated host, and premium bottle service. Experience the ultimate luxury.
                    </p>
                    <Link href="/vip" className="relative inline-flex items-center justify-center bg-transparent text-white border border-white px-12 py-5 rounded-full text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:bg-white hover:text-brand-black">
                        View VIP Packages
                    </Link>
                </div>
            </section>

        </main>
    );
}