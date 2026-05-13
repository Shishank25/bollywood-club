"use client";

import { useEffect, useState } from 'react';

export default function VipPage() {
    // State for the cinematic image reveal
    const [isRevealed, setIsRevealed] = useState(false);

    const vipFeatures = [
        { 
            num: "01", 
            title: "Exclusive Lounge", 
            desc: "Your group will enjoy the best seats in the house, strategically positioned for optimal views of the electrifying dance floor and the pulsating beats.", 
            delay: "0ms" 
        },
        { 
            num: "02", 
            title: "Premium Bottles", 
            desc: "Bottle service that steals the show. Sip on top-shelf spirits and let the beats move you while our dedicated staff keep your glasses filled.", 
            delay: "100ms" 
        },
        { 
            num: "03", 
            title: "Fast-Track Entry", 
            desc: "Skip the lines and make a grand entrance. Our priority entry ensures you're in the spotlight immediately. Walk in like you own the place.", 
            delay: "200ms" 
        },
        { 
            num: "04", 
            title: "Bespoke Packages", 
            desc: "Tailor your VIP experience to perfection by choosing from our customizable packages, whether celebrating a milestone or a casual night out.", 
            delay: "300ms" 
        }
    ];

    useEffect(() => {
        // Trigger the clip-path reveal slightly after mount
        const revealTimer = setTimeout(() => setIsRevealed(true), 100);

        // Scroll Reveal Animations (.fade-up is in globals.css from previous steps)
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
            <section className="relative h-[75svh] min-h-[500px] w-full px-6 md:px-12 pt-28 pb-12 flex flex-col">
                <div 
                    className={`relative w-full h-full rounded-[2rem] overflow-hidden bg-brand-black shadow-xl transition-[clip-path] duration-[1200ms] ease-custom ${
                        isRevealed ? '[clip-path:polygon(0_0,_100%_0,_100%_100%,_0_100%)]' : '[clip-path:polygon(0_100%,_100%_100%,_100%_100%,_0_100%)]'
                    }`}
                >
                    {/* Subtle 8-second zoom-out effect on load */}
                    <img 
                        src="https://images.unsplash.com/photo-1574160408544-672535091a18?q=80&w=1600&auto=format&fit=crop" 
                        alt="VIP Crowd"
                        className={`absolute inset-0 w-full h-full object-cover filter grayscale-[30%] mix-blend-screen opacity-60 transition-transform duration-[8000ms] ease-out ${
                            isRevealed ? 'scale-100' : 'scale-[1.05]'
                        }`} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent"></div>
                    
                    <div className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 z-20">
                        <div className="fade-up">
                            <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-brand-white bg-brand-accent px-4 py-2 rounded-full mb-6">
                                Bottle Service
                            </span>
                            <h1 className="text-5xl md:text-7xl lg:text-[8vw] leading-[0.9] font-display font-extrabold uppercase tracking-tighter text-brand-white">
                                VIP <span className="text-transparent [-webkit-text-stroke:1px_#FFFFFF]">Tables</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* INTRO TEXT SECTION */}
            <section className="py-20 px-6 md:px-12 bg-brand-white text-center">
                <div className="max-w-4xl mx-auto fade-up">
                    <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tighter uppercase text-brand-black mb-6">
                        Elevate Your Nightlife <br />
                        <span className="text-brand-gray text-2xl md:text-4xl">With Our Exclusive VIP Packages</span>
                    </h2>
                    <div className="w-16 h-[2px] bg-brand-black mx-auto mb-8"></div>
                    <p className="text-sm md:text-base font-medium text-brand-gray leading-relaxed max-w-3xl mx-auto">
                        Indulge in the ultimate VIP treatment with Bollywood Club, where luxury meets excitement. Our VIP Booth Package is designed to take your night out to extraordinary heights, offering an exclusive haven for you and your entourage to revel in style and absolute glamour.
                    </p>
                </div>
            </section>

            {/* BOOKING FORM SECTION */}
            <section className="py-12 px-6 md:px-12 bg-brand-white border-t border-brand-border">
                <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">
                    
                    {/* Left Image Reveal */}
                    <div 
                        className={`w-full lg:w-1/2 relative rounded-[2rem] overflow-hidden min-h-[600px] transition-[clip-path] duration-[1200ms] ease-custom ${
                            isRevealed ? '[clip-path:polygon(0_0,_100%_0,_100%_100%,_0_100%)]' : '[clip-path:polygon(0_100%,_100%_100%,_100%_100%,_0_100%)]'
                        }`}
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000&auto=format&fit=crop" 
                            className="absolute inset-0 w-full h-full object-cover filter grayscale-[10%]" 
                            alt="VIP Experience" 
                        />
                        <div className="absolute inset-0 bg-brand-black/20"></div>
                        
                        <div className="absolute bottom-12 left-12 mix-blend-difference text-brand-white z-10">
                            <h3 className="text-6xl md:text-8xl font-display font-extrabold uppercase tracking-tighter leading-none">
                                The <br /> Inner <br /> <span className="text-brand-accent">Circle</span>
                            </h3>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center py-8 fade-up" style={{ transitionDelay: '200ms' }}>
                        <div className="max-w-xl w-full mx-auto lg:mx-0">
                            <h3 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-brand-black mb-2">Request A Table</h3>
                            <p className="text-xs font-bold tracking-[0.15em] uppercase text-brand-gray mb-12">Secure your premium access.</p>
                            
                            {/* Converted .form-input to inline Tailwind classes */}
                            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <input type="text" placeholder="FIRST NAME *" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray" />
                                    </div>
                                    <div>
                                        <input type="text" placeholder="LAST NAME *" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray" />
                                    </div>
                                </div>

                                <div className="flex items-end border-b border-brand-black pb-2 transition-colors focus-within:border-brand-accent group">
                                    <div className="flex items-center gap-2 mr-4 text-xs font-bold tracking-widest text-brand-black">
                                        <span>+61</span>
                                    </div>
                                    <input type="tel" placeholder="PHONE NUMBER *" required className="w-full bg-transparent text-xs font-bold tracking-[0.15em] uppercase outline-none placeholder-brand-gray text-brand-black" />
                                </div>

                                <div>
                                    <input type="email" placeholder="EMAIL ADDRESS *" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-1">
                                        <input type="text" placeholder="CITY" className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray" />
                                    </div>
                                    <div className="md:col-span-1">
                                        <input type="date" className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-gray [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="md:col-span-1">
                                        <input type="number" min="1" placeholder="EST. GUESTS" className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray" />
                                    </div>
                                </div>

                                {/* Pure Tailwind Monumental Button */}
                                <button type="submit" className="group relative overflow-hidden inline-flex items-center justify-center w-full py-5 text-xs font-bold tracking-[0.15em] uppercase mt-8 bg-brand-black text-white transition-colors duration-300">
                                    <div className="absolute top-full left-0 w-full h-full bg-brand-accent transition-all duration-[400ms] ease-custom z-10 group-hover:top-0"></div>
                                    <span className="relative z-20">Submit Request</span>
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="py-24 px-6 md:px-12 bg-brand-offwhite">
                <div className="max-w-[1600px] mx-auto">
                    
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 fade-up">
                        <div className="max-w-2xl">
                            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-brand-gray mb-4">The VIP Standard</h3>
                            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase text-brand-black leading-[0.9]">
                                Why Settle For <br /> 
                                <span className="text-transparent [-webkit-text-stroke:1px_#0A0A0A] hover:text-brand-black hover:[-webkit-text-stroke:0px] transition-colors duration-400 cursor-default">Ordinary?</span>
                            </h2>
                        </div>
                        <div className="mt-6 md:mt-0 max-w-sm">
                            <p className="text-sm font-medium text-brand-gray leading-relaxed">
                                Our package is the real deal, giving you the red carpet treatment you absolutely deserve. Here is what is included.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {vipFeatures.map((feature, i) => (
                            <div 
                                key={i} 
                                className="bg-brand-offwhite border border-transparent p-10 flex flex-col justify-between min-h-[300px] transition-all duration-[400ms] ease-custom hover:bg-white hover:border-brand-black hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] fade-up group" 
                                style={{ transitionDelay: feature.delay }}
                            >
                                <div className="mb-8">
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

            {/* BIRTHDAY CTA SECTION */}
            <section className="py-32 px-6 md:px-12 bg-brand-black text-brand-white relative overflow-hidden flex items-center justify-center text-center">
                {/* Glowing Background Orb */}
                <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-accent rounded-full mix-blend-screen filter blur-[100px]"></div>
                </div>
                
                <div className="relative z-10 max-w-3xl mx-auto fade-up">
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold uppercase tracking-tighter leading-[0.9] mb-8">
                        Celebrating A <br /> 
                        <span className="text-transparent [-webkit-text-stroke:1px_#FFFFFF]">Birthday?</span>
                    </h2>
                    <p className="text-sm md:text-base font-medium text-brand-gray mb-12 max-w-xl mx-auto leading-relaxed">
                        Get your birthday vibes on with a friend for free. Secure exclusive birthday deals and complimentary ticket offers to make your night legendary.
                    </p>
                    {/* Pure Tailwind Outline Button */}
                    <a href="#" className="relative inline-flex items-center justify-center bg-transparent text-white border border-white px-12 py-5 rounded-full text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:bg-white hover:text-brand-black">
                        View Birthday Offers
                    </a>
                </div>
            </section>
            
        </main>
    );
}