"use client";

import { useEffect, useState } from 'react';

export default function CareersPage() {
    // State for the cinematic image reveal on load
    const [isRevealed, setIsRevealed] = useState(false);

    // Roles Data Array to keep JSX clean
    const roles = [
        {
            title: "Promoters",
            icon: "fa-solid fa-bullhorn",
            desc: "Expand our reach. Bring the energy to the streets and pack the club with your network.",
            cols: "lg:col-span-2",
            delay: "0ms"
        },
        {
            title: "Influencers",
            icon: "fa-solid fa-camera-retro",
            desc: "Shape the culture. Share the vibe and capture the definitive moments of our events online.",
            cols: "lg:col-span-2",
            delay: "100ms"
        },
        {
            title: "DJs & Artists",
            icon: "fa-solid fa-compact-disc",
            desc: "Control the rhythm. Bring your unique sound and keep the dancefloor alive until dawn.",
            cols: "lg:col-span-2",
            delay: "200ms"
        },
        {
            title: "Live Musicians",
            icon: "fa-solid fa-guitar",
            desc: "Elevate the live experience. Blend classical elements with modern, high-energy club tracks.",
            cols: "lg:col-span-3",
            delay: "0ms"
        },
        {
            title: "Vocalists",
            icon: "fa-solid fa-microphone-lines",
            desc: "Command the crowd. Deliver powerful performances that act as the centerpiece of our shows.",
            cols: "lg:col-span-3",
            delay: "100ms"
        }
    ];

    useEffect(() => {
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
            fadeElements.forEach(el => observer.unobserve(el));
        };
    }, []);

    return (
        <main className="w-full selection:bg-brand-black selection:text-white">
            
            {/* HERO SECTION */}
            <section className="relative w-full px-4 md:px-8 pt-28 pb-12 flex flex-col">
                <div 
                    className={`relative w-full h-[40svh] md:h-[50svh] min-h-[350px] rounded-[2rem] overflow-hidden bg-brand-black shadow-2xl flex items-center justify-center text-center transition-[clip-path] duration-[1200ms] ease-custom ${
                        isRevealed ? '[clip-path:polygon(0_0,_100%_0,_100%_100%,_0_100%)]' : '[clip-path:polygon(0_100%,_100%_100%,_100%_100%,_0_100%)]'
                    }`}
                >
                    <img 
                        src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop" 
                        alt="Careers Background"
                        className={`absolute inset-0 w-full h-full object-cover filter grayscale-[10%] opacity-70 transition-transform duration-[10000ms] ease-out ${
                            isRevealed ? 'scale-100' : 'scale-[1.15]'
                        }`} 
                    />
                    
                    <div className="absolute inset-0 bg-brand-black/30"></div>
                    
                    <div className="relative z-20 fade-up px-6 w-full flex flex-col items-center">
                        <span className="inline-block text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-brand-black bg-brand-white px-5 py-2.5 rounded-full shadow-lg mb-4 md:mb-6">
                            Join The Movement
                        </span>
                        
                        <h1 className="text-6xl md:text-8xl lg:text-[8vw] leading-none font-display font-extrabold uppercase tracking-tighter text-brand-white whitespace-nowrap">
                            CA<span className="text-transparent [-webkit-text-stroke:1.5px_#FFFFFF] py-[0.15em] inline-block align-bottom">REERS</span>
                        </h1>
                    </div>
                </div>
            </section>

            {/* INTRO TEXT SECTION */}
            <section className="py-16 md:py-20 px-6 md:px-12 bg-brand-white text-center">
                <div className="max-w-4xl mx-auto fade-up">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tighter uppercase text-brand-black mb-6 leading-[0.95]">
                        Build A Career. <br />
                        <span className="text-brand-gray text-transparent [-webkit-text-stroke:1px_#0A0A0A] hover:text-brand-black hover:[-webkit-text-stroke:0px] transition-all duration-400 cursor-default">Build The Hype.</span>
                    </h2>
                    <div className="w-16 h-[2px] bg-brand-accent mx-auto mb-8"></div>
                    <p className="text-sm md:text-base font-medium text-brand-gray leading-relaxed max-w-2xl mx-auto mb-6">
                        Bollywood Club aspires to build an interconnected community of nightlife enthusiasts. We are looking to connect, collaborate, and build a career while doing something that pushes the boundaries of entertainment.
                    </p>
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-black mt-8">
                        If you believe in us, come join us.
                    </p>
                </div>
            </section>

            {/* OPEN POSITIONS GRID */}
            <section className="py-24 px-6 md:px-12 bg-brand-offwhite border-t border-brand-border">
                <div className="max-w-[1600px] mx-auto">
                    
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 fade-up">
                        <div className="max-w-2xl">
                            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-brand-gray mb-4">Open Positions</h3>
                            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase text-brand-black leading-[0.9]">
                                Join The <span className="text-transparent [-webkit-text-stroke:1px_#0A0A0A]">Roster</span>
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                        {roles.map((role, i) => (
                            <div 
                                key={i} 
                                className={`${role.cols} group bg-brand-offwhite border border-transparent p-10 flex flex-col min-h-[280px] rounded-2xl cursor-pointer transition-all duration-[400ms] ease-custom hover:bg-brand-black hover:border-brand-black hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] fade-up`}
                                style={{ transitionDelay: role.delay }}
                            >
                                <div className="text-3xl text-brand-black mb-8 transition-colors duration-300 group-hover:text-brand-accent">
                                    <i className={role.icon}></i>
                                </div>
                                <div className="mt-auto">
                                    <h4 className="text-xl font-display font-bold uppercase tracking-tighter text-brand-black mb-2 transition-colors duration-300 group-hover:text-white">
                                        {role.title}
                                    </h4>
                                    <p className="text-xs text-brand-gray leading-relaxed font-medium transition-colors duration-300 group-hover:text-white/80">
                                        {role.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* APPLICATION FORM SECTION */}
            <section className="py-12 px-6 md:px-12 bg-brand-white border-t border-brand-border">
                <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">
                    
                    {/* Left Image Reveal */}
                    <div 
                        className={`w-full lg:w-1/2 relative rounded-[2rem] overflow-hidden min-h-[600px] transition-[clip-path] duration-[1200ms] ease-custom ${
                            isRevealed ? '[clip-path:polygon(0_0,_100%_0,_100%_100%,_0_100%)]' : '[clip-path:polygon(0_100%,_100%_100%,_100%_100%,_0_100%)]'
                        }`}
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop" 
                            className="absolute inset-0 w-full h-full object-cover filter grayscale-[10%]" 
                            alt="On Stage" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 to-transparent"></div>
                        
                        <div className="absolute bottom-12 left-12 mix-blend-difference text-brand-white z-10 pr-8">
                            <h3 className="text-5xl md:text-7xl font-display font-extrabold uppercase tracking-tighter leading-none mb-4">
                                Take The <br /> <span className="text-brand-accent">Stage</span>
                            </h3>
                            <p className="text-xs font-bold tracking-[0.15em] uppercase text-brand-white/80">Our talent team reviews all submissions.</p>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center py-8 fade-up" style={{ transitionDelay: '200ms' }}>
                        <div className="max-w-xl w-full mx-auto lg:mx-0">
                            <h3 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-brand-black mb-2">Application Form</h3>
                            <p className="text-xs font-bold tracking-[0.15em] uppercase text-brand-gray mb-12 border-b border-brand-border pb-6">Submit your details and portfolio below.</p>
                            
                            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <input type="text" placeholder="FIRST NAME *" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" />
                                    </div>
                                    <div>
                                        <input type="text" placeholder="LAST NAME" className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex items-end border-b border-brand-black pb-2 transition-colors focus-within:border-brand-accent group">
                                        <div className="flex items-center gap-2 mr-4 text-xs font-bold tracking-widest text-brand-black">
                                            <span>+61</span>
                                        </div>
                                        <input type="tel" placeholder="PHONE NUMBER" className="w-full bg-transparent text-xs font-bold tracking-[0.15em] uppercase outline-none placeholder-brand-gray text-brand-black rounded-none" />
                                    </div>
                                    <div>
                                        <input type="email" placeholder="EMAIL ADDRESS *" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <input type="date" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-gray [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 transition-opacity rounded-none" />
                                    </div>
                                    <div>
                                        <input type="url" placeholder="SOCIAL / PORTFOLIO LINK *" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" />
                                    </div>
                                </div>

                                <div>
                                    <div className="relative">
                                        <select required defaultValue="" className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black appearance-none cursor-pointer pr-8 rounded-none">
                                            <option value="" disabled>SELECT ROLE *</option>
                                            <option value="promoter">Promoter</option>
                                            <option value="influencer">Influencer</option>
                                            <option value="artist">Artist (DJ/Producer)</option>
                                            <option value="musician">Live Musician</option>
                                            <option value="vocalist">Vocalist</option>
                                        </select>
                                        <i className="fa-solid fa-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-brand-black pointer-events-none"></i>
                                    </div>
                                </div>

                                {/* Pure Tailwind Monumental Button */}
                                <button type="submit" className="group relative overflow-hidden inline-flex items-center justify-center w-full py-5 text-xs font-bold tracking-[0.15em] uppercase mt-8 bg-brand-black text-white transition-colors duration-300">
                                    <div className="absolute top-full left-0 w-full h-full bg-brand-accent transition-all duration-[400ms] ease-custom z-10 group-hover:top-0"></div>
                                    <span className="relative z-20">Submit Application</span>
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </section>

        </main>
    );
}