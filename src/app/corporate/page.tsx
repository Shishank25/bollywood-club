"use client";

import { useEffect, useState } from 'react';

export default function CorporateEventsPage() {
    // State for the cinematic image reveal on load
    const [isRevealed, setIsRevealed] = useState(false);

    const capabilities = [
        {
            icon: "fa-solid fa-building",
            title: "Venue Setup",
            desc: "Access to the most exclusive club spaces, completely transformed to match your corporate branding and specific event requirements.",
            delay: "0ms"
        },
        {
            icon: "fa-solid fa-microphone-lines",
            title: "AV & Tech Support",
            desc: "State-of-the-art sound systems, dynamic lighting rigs, and giant LED screens perfect for presentations and impactful branding.",
            delay: "100ms"
        },
        {
            icon: "fa-solid fa-martini-glass-citrus",
            title: "Premium Catering",
            desc: "From elegant canapés to full banquet dinners, our curated catering partners and top-tier mixologists will keep your guests delighted.",
            delay: "200ms"
        },
        {
            icon: "fa-solid fa-handshake",
            title: "End-to-End Planning",
            desc: "Our dedicated corporate event managers act as an extension of your team, ensuring flawless execution from initial concept to final toast.",
            delay: "300ms"
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
            <section className="relative w-full px-4 md:px-8 pt-28 pb-8 flex flex-col">
                <div 
                    className={`relative w-full h-[65vh] min-h-[500px] rounded-[2rem] overflow-hidden bg-brand-black shadow-2xl transition-[clip-path] duration-[1200ms] ease-custom ${
                        isRevealed ? '[clip-path:polygon(0_0,_100%_0,_100%_100%,_0_100%)]' : '[clip-path:polygon(0_100%,_100%_100%,_100%_100%,_0_100%)]'
                    }`}
                >
                    <img 
                        src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1600&auto=format&fit=crop" 
                        alt="Corporate Event"
                        className={`absolute inset-0 w-full h-full object-cover filter grayscale-[40%] opacity-60 transition-transform duration-[10000ms] ease-out ${
                            isRevealed ? 'scale-100' : 'scale-[1.15]'
                        }`} 
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black/95 via-brand-black/40 to-brand-black/10"></div>
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 lg:p-20 z-20">
                        <div className="fade-up max-w-5xl">
                            <div className="flex flex-wrap gap-3 mb-6 md:mb-8">
                                <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-brand-black bg-brand-white px-5 py-2.5 rounded-full shadow-lg">
                                    Professional Gatherings
                                </span>
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl lg:text-[7vw] leading-[1.1] font-display font-extrabold uppercase tracking-tighter text-brand-white">
                                Corporate <br className="md:hidden" /> 
                                <span className="text-transparent [-webkit-text-stroke:1.5px_#FFFFFF] py-[0.15em] inline-block">Events</span>
                            </h1>
                            
                            <p className="mt-4 text-brand-white/80 text-sm md:text-base font-medium max-w-xl leading-relaxed border-l-2 border-brand-accent pl-4">
                                Where professional excellence meets unparalleled nightlife luxury. Host your next milestone with Bollywood Club.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* INTRO SECTION */}
            <section className="py-20 px-6 md:px-12 bg-brand-white text-center">
                <div className="max-w-4xl mx-auto fade-up">
                    <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tighter uppercase text-brand-black mb-6 leading-[1.1]">
                        Looking To Host An <br />
                        <span className="text-brand-gray text-transparent [-webkit-text-stroke:1px_#0A0A0A] hover:text-brand-black hover:[-webkit-text-stroke:0px] transition-all duration-400 cursor-default">Unforgettable Event?</span>
                    </h2>
                    <div className="w-16 h-[2px] bg-brand-accent mx-auto mb-8"></div>
                    <p className="text-sm md:text-base font-medium text-brand-gray leading-relaxed max-w-3xl mx-auto mb-6">
                        We specialize in organizing professional gatherings like large-scale conferences, award ceremonies, high-energy product launches, and exclusive team-building sessions. 
                    </p>
                    <p className="text-sm md:text-base font-medium text-brand-gray leading-relaxed max-w-3xl mx-auto">
                        With our expertise in planning and execution, we ensure seamless events tailored exactly to your company’s vision. From striking venue setups to AV support and premium catering, we handle every detail.
                    </p>
                </div>
            </section>

            {/* PERFECT FOR TAGS SECTION */}
            <section className="py-12 border-y border-brand-border bg-brand-offwhite overflow-hidden flex items-center justify-center fade-up">
                <div className="max-w-[1600px] w-full px-6 flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-12">
                    <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-brand-gray">Perfect For:</span>
                    <span className="text-sm md:text-lg font-display font-bold uppercase tracking-tighter text-brand-black">Award Galas</span>
                    <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                    <span className="text-sm md:text-lg font-display font-bold uppercase tracking-tighter text-brand-black">Product Launches</span>
                    <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                    <span className="text-sm md:text-lg font-display font-bold uppercase tracking-tighter text-brand-black">End Of Year Parties</span>
                    <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                    <span className="text-sm md:text-lg font-display font-bold uppercase tracking-tighter text-brand-black">Team Building</span>
                </div>
            </section>

            {/* CAPABILITIES SECTION */}
            <section className="py-24 px-6 md:px-12 bg-brand-white">
                <div className="max-w-[1600px] mx-auto">
                    
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 fade-up">
                        <div className="max-w-2xl">
                            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-brand-gray mb-4">Our Capabilities</h3>
                            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase text-brand-black leading-[0.9]">
                                Seamless <span className="text-transparent [-webkit-text-stroke:1.5px_#0A0A0A]">Execution,</span> <br /> Premium Experience
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {capabilities.map((item, i) => (
                            <div 
                                key={i} 
                                className="group bg-brand-offwhite border border-transparent p-10 flex flex-col min-h-[320px] rounded-2xl cursor-pointer transition-all duration-[400ms] ease-custom hover:bg-brand-black hover:border-brand-black hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] fade-up"
                                style={{ transitionDelay: item.delay }}
                            >
                                <div className="text-3xl text-brand-black mb-8 transition-colors duration-300 group-hover:text-brand-accent">
                                    <i className={item.icon}></i>
                                </div>
                                <div className="mt-auto">
                                    <h4 className="text-xl font-display font-bold uppercase tracking-tighter text-brand-black mb-3 transition-colors duration-300 group-hover:text-white">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-brand-gray leading-relaxed font-medium transition-colors duration-300 group-hover:text-white/80">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROPOSAL FORM SECTION */}
            <section className="py-12 px-6 md:px-12 bg-brand-white border-t border-brand-border">
                <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">
                    
                    {/* Left Image Reveal */}
                    <div 
                        className={`w-full lg:w-1/2 relative rounded-[2rem] overflow-hidden min-h-[600px] transition-[clip-path] duration-[1200ms] ease-custom ${
                            isRevealed ? '[clip-path:polygon(0_0,_100%_0,_100%_100%,_0_100%)]' : '[clip-path:polygon(0_100%,_100%_100%,_100%_100%,_0_100%)]'
                        }`}
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=1000&auto=format&fit=crop" 
                            className="absolute inset-0 w-full h-full object-cover filter grayscale-[10%]" 
                            alt="Corporate Event Setup" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 to-transparent"></div>
                        
                        <div className="absolute bottom-12 left-12 mix-blend-difference text-brand-white z-10 pr-8">
                            <h3 className="text-5xl md:text-7xl font-display font-extrabold uppercase tracking-tighter leading-none mb-4">
                                Let's Create <br /> <span className="text-brand-accent">Extraordinary</span>
                            </h3>
                            <p className="text-xs font-bold tracking-[0.15em] uppercase text-brand-white/80">Tailored proposals within 24 hours.</p>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center py-8 fade-up" style={{ transitionDelay: '200ms' }}>
                        <div className="max-w-xl w-full mx-auto lg:mx-0">
                            <h3 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-brand-black mb-2">Request A Proposal</h3>
                            <p className="text-xs font-bold tracking-[0.15em] uppercase text-brand-gray mb-12 border-b border-brand-border pb-6">Tell us about your upcoming event.</p>
                            
                            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <input type="text" placeholder="FIRST NAME *" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" />
                                    </div>
                                    <div>
                                        <input type="text" placeholder="LAST NAME *" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" />
                                    </div>
                                </div>

                                <div>
                                    <input type="text" placeholder="COMPANY NAME *" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <input type="email" placeholder="WORK EMAIL *" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" />
                                    </div>
                                    <div className="flex items-end border-b border-brand-black pb-2 transition-colors focus-within:border-brand-accent group">
                                        <div className="flex items-center gap-2 mr-4 text-xs font-bold tracking-widest text-brand-black">
                                            <span>+61</span>
                                        </div>
                                        <input type="tel" placeholder="PHONE NUMBER" className="w-full bg-transparent text-xs font-bold tracking-[0.15em] uppercase outline-none placeholder-brand-gray text-brand-black rounded-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <input type="text" placeholder="LOCATION / CITY *" required className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" />
                                    </div>
                                    <div>
                                        <input type="number" min="1" placeholder="EST. GUESTS" className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" />
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