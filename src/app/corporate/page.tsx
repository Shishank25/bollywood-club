"use client";

import { useEffect, useState } from 'react';
import { MediaAsset } from '@/lib/media';
import MediaSlot from '@/lib/media';

export default function CorporateEventsPage() {
    // State for media fetching
    const [media, setMedia] = useState<Record<string, MediaAsset>>({});
    const [isLoading, setIsLoading] = useState(true);

    // State for the cinematic image reveal on load
    const [isRevealed, setIsRevealed] = useState(false);

    const capabilities = [
        {
            id: "cap-1",
            icon: "fa-solid fa-building",
            title: "Venue Setup",
            desc: "Access to the most exclusive club spaces, completely transformed to match your corporate branding and specific event requirements.",
            delay: "0ms"
        },
        {
            id: "cap-2",
            icon: "fa-solid fa-microphone-lines",
            title: "AV & Tech Support",
            desc: "State-of-the-art sound systems, dynamic lighting rigs, and giant LED screens perfect for presentations and impactful branding.",
            delay: "100ms"
        },
        {
            id: "cap-3",
            icon: "fa-solid fa-martini-glass-citrus",
            title: "Premium Catering",
            desc: "From elegant canapés to full banquet dinners, our curated catering partners and top-tier mixologists will keep your guests delighted.",
            delay: "200ms"
        },
        {
            id: "cap-4",
            icon: "fa-solid fa-handshake",
            title: "End-to-End Planning",
            desc: "Our dedicated corporate event managers act as an extension of your team, ensuring flawless execution from initial concept to final toast.",
            delay: "300ms"
        }
    ];

    // 1. Fetch Media from your GET Route
    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const res = await fetch('/api/media?page=/corporate');
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
                        id="hero-media" 
                        mediaMap={media} 
                        className={`absolute inset-0 w-full h-full object-cover filter grayscale-[20%] opacity-70 transition-transform duration-[8000ms] ease-out ${
                            isRevealed ? 'scale-100' : 'scale-[1.05]'
                        }`}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent"></div>
                    
                    <div className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 z-20">
                        <div className="fade-up">
                            <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-brand-white bg-brand-accent px-4 py-2 rounded-full mb-6">
                                Unforgettable Experiences
                            </span>
                            <h1 className="text-5xl md:text-7xl lg:text-[8vw] leading-[0.9] font-display font-extrabold uppercase tracking-tighter text-brand-white">
                                Corpo<span className="text-transparent [-webkit-text-stroke:1px_#FFFFFF]">rate</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TEXT INTRO SECTION ── */}
            <section className="py-20 px-6 md:px-12 bg-brand-white text-center">
                <div className="max-w-4xl mx-auto fade-up">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tighter uppercase text-brand-black mb-6 leading-[0.95]">
                        Redefine Your <br />
                        <span className="text-transparent [-webkit-text-stroke:1px_#0A0A0A] text-brand-gray">Corporate Culture</span>
                    </h2>
                    <div className="w-16 h-[2px] bg-brand-accent mx-auto mb-8"></div>
                    <p className="text-sm md:text-base font-medium text-brand-gray leading-relaxed max-w-2xl mx-auto">
                        Elevate your next company milestone, product launch, or end-of-year celebration with Bollywood Club's premier event services. We blend sophisticated execution with unparalleled entertainment.
                    </p>
                </div>
            </section>

            {/* ── CAPABILITIES SECTION ── */}
            <section className="py-24 px-6 md:px-12 bg-brand-offwhite">
                <div className="max-w-[1600px] mx-auto">
                    <div className="flex justify-center mb-16 fade-up">
                        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter uppercase text-brand-black">
                            Our Capabilities
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {capabilities.map((cap) => (
                            <div 
                                key={cap.id} 
                                className="bg-brand-white p-6 rounded-2xl shadow-sm border border-brand-border/50 hover:border-brand-black hover:shadow-lg transition-all duration-300 fade-up group flex flex-col"
                                style={{ transitionDelay: cap.delay }}
                            >
                                {/* NEW: MediaSlot container for the card */}
                                <div className="w-full h-40 mb-6 overflow-hidden rounded-xl bg-brand-border/20">
                                    <MediaSlot 
                                        id={cap.id} 
                                        mediaMap={media} 
                                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" 
                                    />
                                </div>

                                <div className="w-14 h-14 rounded-full bg-brand-offwhite flex items-center justify-center text-brand-black text-xl mb-6 group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300">
                                    <i className={cap.icon}></i>
                                </div>
                                
                                <h3 className="text-xl font-display font-bold uppercase tracking-tighter text-brand-black mb-3">
                                    {cap.title}
                                </h3>
                                
                                <p className="text-sm font-medium text-brand-gray leading-relaxed flex-1">
                                    {cap.desc}
                                </p>
                            </div>
                        ))}
                    </div>
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
                                Make An <br /> <span className="text-brand-accent">Inquiry</span>
                            </h3>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center py-8 fade-up" style={{ transitionDelay: '200ms' }}>
                        <div className="max-w-xl w-full mx-auto lg:mx-0">
                            <h3 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-brand-black mb-2">Plan Your Event</h3>
                            <p className="text-xs font-bold tracking-[0.15em] uppercase text-brand-gray mb-12">Submit your requirements to our events team.</p>
                            
                            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <input type="text" placeholder="COMPANY NAME *" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" />
                                    </div>
                                    <div>
                                        <input type="text" placeholder="CONTACT NAME *" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex items-end border-b border-brand-black pb-2 transition-colors focus-within:border-brand-accent group">
                                        <div className="flex items-center gap-2 mr-4 text-xs font-bold tracking-widest text-brand-black">
                                            <span>+61</span>
                                        </div>
                                        <input type="tel" placeholder="PHONE NUMBER *" required className="w-full bg-transparent text-xs font-bold tracking-[0.15em] uppercase outline-none placeholder-brand-gray text-brand-black rounded-none" />
                                    </div>
                                    <div>
                                        <input type="email" placeholder="EMAIL ADDRESS *" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" />
                                    </div>
                                </div>

                                <div>
                                    <textarea rows={4} placeholder="EVENT DETAILS (DATES, OCCASION, SPECIFIC REQUIREMENTS)" className="w-full bg-transparent border-b border-brand-black pb-2 pt-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray resize-none rounded-none"></textarea>
                                </div>

                                {/* Pure Tailwind Monumental Button */}
                                <button type="submit" className="group relative overflow-hidden inline-flex items-center justify-center w-full py-5 text-xs font-bold tracking-[0.15em] uppercase mt-8 bg-brand-black text-white transition-colors duration-300">
                                    <div className="absolute top-full left-0 w-full h-full bg-brand-accent transition-all duration-[400ms] ease-custom z-10 group-hover:top-0"></div>
                                    <span className="relative z-20">Submit Inquiry</span>
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </section>

        </main>
    );
}