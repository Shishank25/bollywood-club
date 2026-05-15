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

    // --- FORM STATE ---
    const [formData, setFormData] = useState({
        f_name: '',        // First Name
        l_name: '',        // Last Name
        company_name: '',  // Company Name
        email: '',
        phone: '',
        description: ''    // Event Details
    });
    
    // City Selection State
    const [citySelection, setCitySelection] = useState("");
    const [customCity, setCustomCity] = useState("");
    
    const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
        if (isLoading) return; 

        // Trigger the clip-path and zoom reveal slightly after mount
        const revealTimer = setTimeout(() => setIsRevealed(true), 100);

        // Scroll Reveal Animations 
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

    // --- FORM SUBMIT HANDLER ---
    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('loading');

        // Determine final city based on dropdown vs custom input
        const finalCity = citySelection === 'Other' ? customCity : citySelection;

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    form_type: 'corporate_inquiry',
                    f_name: formData.f_name,
                    l_name: formData.l_name,
                    company_name: formData.company_name, // Explicitly mapped
                    email: formData.email,
                    phone: formData.phone,
                    city: finalCity,
                    description: formData.description
                })
            });

            if (res.ok) {
                setFormStatus('success');
                setFormData({ f_name: '', l_name: '', company_name: '', email: '', phone: '', description: '' });
                setCitySelection("");
                setCustomCity("");
            } else {
                setFormStatus('error');
            }
        } catch (error) {
            setFormStatus('error');
        }
    };

    return (
        <main className="w-full selection:bg-brand-black selection:text-white">
            
            {/* ── HERO SECTION ── */}
            <section className="relative h-[75svh] min-h-[500px] w-full px-6 md:px-12 pt-28 pb-12 flex flex-col">
                <div 
                    className={`relative w-full h-full rounded-[2rem] overflow-hidden bg-brand-black shadow-xl transition-[clip-path] duration-[1200ms] ease-custom ${
                        isRevealed ? '[clip-path:polygon(0_0,_100%_0,_100%_100%,_0_100%)]' : '[clip-path:polygon(0_100%,_100%_100%,_100%_100%,_0_100%)]'
                    }`}
                >
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
                            
                            {/* Render Success State OR The Form */}
                            {formStatus === 'success' ? (
                                <div className="bg-brand-black text-white p-8 rounded-xl text-center animate-in fade-in zoom-in duration-500">
                                    <h3 className="text-2xl font-display font-bold uppercase tracking-tighter mb-2">Inquiry Sent</h3>
                                    <p className="text-xs font-bold tracking-[0.15em] uppercase text-brand-gray">Our corporate events team will contact you shortly.</p>
                                </div>
                            ) : (
                                <form className="space-y-8" onSubmit={handleSubscribe}>

                                    {formStatus === 'error' && (
                                        <div className="text-red-500 text-xs font-bold uppercase tracking-widest">
                                            An error occurred. Please try again.
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <input 
                                                type="text" 
                                                placeholder="FIRST NAME *" 
                                                required 
                                                value={formData.f_name}
                                                onChange={(e) => setFormData({...formData, f_name: e.target.value})}
                                                className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" 
                                            />
                                        </div>
                                        <div>
                                            <input 
                                                type="text" 
                                                placeholder="LAST NAME *" 
                                                required 
                                                value={formData.l_name}
                                                onChange={(e) => setFormData({...formData, l_name: e.target.value})}
                                                className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" 
                                            />
                                        </div>
                                    </div>

                                    {/* DEDICATED COMPANY NAME FIELD */}
                                    <div>
                                        <input 
                                            type="text" 
                                            placeholder="COMPANY NAME *" 
                                            required 
                                            value={formData.company_name}
                                            onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                                            className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" 
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="flex items-end border-b border-brand-black pb-2 transition-colors focus-within:border-brand-accent group">
                                            <div className="flex items-center gap-2 mr-4 text-xs font-bold tracking-widest text-brand-black">
                                                <span>+61</span>
                                            </div>
                                            <input 
                                                type="tel" 
                                                placeholder="PHONE NUMBER *" 
                                                required 
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                className="w-full bg-transparent text-xs font-bold tracking-[0.15em] uppercase outline-none placeholder-brand-gray text-brand-black rounded-none" 
                                            />
                                        </div>
                                        <div>
                                            <input 
                                                type="email" 
                                                placeholder="EMAIL ADDRESS *" 
                                                required 
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" 
                                            />
                                        </div>
                                    </div>

                                    {/* ── DYNAMIC CITY DROPDOWN ── */}
                                    <div className="relative border-b border-brand-black pb-2 focus-within:border-brand-accent transition-colors duration-300">
                                        <select
                                            value={citySelection}
                                            onChange={(e) => setCitySelection(e.target.value)}
                                            className={`w-full bg-transparent text-xs font-bold tracking-[0.15em] uppercase outline-none appearance-none cursor-pointer rounded-none ${citySelection === "" ? 'text-brand-gray' : 'text-brand-black'}`}
                                            required
                                        >
                                            <option value="" disabled className="text-brand-gray">SELECT CITY *</option>
                                            <option value="Melbourne" className="text-brand-black">Melbourne</option>
                                            <option value="Sydney" className="text-brand-black">Sydney</option>
                                            <option value="Perth" className="text-brand-black">Perth</option>
                                            <option value="Adelaide" className="text-brand-black">Adelaide</option>
                                            <option value="Brisbane" className="text-brand-black">Brisbane</option>
                                            <option value="Singapore" className="text-brand-black">Singapore</option>
                                            <option value="Other" className="text-brand-black">Other</option>
                                        </select>
                                        <div className="absolute right-0 top-[20%] pointer-events-none pb-2">
                                            <i className="fa-solid fa-chevron-down text-brand-gray text-xs"></i>
                                        </div>
                                    </div>

                                    {/* ── CONDITIONAL "OTHER" CITY INPUT ── */}
                                    {citySelection === 'Other' && (
                                        <div className="animate-in slide-in-from-top-2 duration-300">
                                            <input
                                                type="text"
                                                placeholder="ENTER YOUR CITY *"
                                                value={customCity}
                                                onChange={(e) => setCustomCity(e.target.value)}
                                                className="w-full bg-transparent border-b border-brand-black pb-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none"
                                                required
                                            />
                                        </div>
                                    )}

                                    {/* ── EVENT DETAILS / DESCRIPTION ── */}
                                    <div>
                                        <textarea 
                                            rows={4} 
                                            placeholder="EVENT DETAILS (DATES, OCCASION, SPECIFIC REQUIREMENTS)" 
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            className="w-full bg-transparent border-b border-brand-black pb-2 pt-2 text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray resize-none rounded-none"
                                        ></textarea>
                                    </div>

                                    {/* Pure Tailwind Monumental Button */}
                                    <button 
                                        type="submit" 
                                        disabled={formStatus === 'loading'}
                                        className="group relative overflow-hidden inline-flex items-center justify-center w-full py-5 text-xs font-bold tracking-[0.15em] uppercase mt-8 bg-brand-black text-white transition-colors duration-300 disabled:opacity-50"
                                    >
                                        <div className="absolute top-full left-0 w-full h-full bg-brand-accent transition-all duration-[400ms] ease-custom z-10 group-hover:top-0"></div>
                                        <span className="relative z-20">{formStatus === 'loading' ? 'Submitting...' : 'Submit Inquiry'}</span>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </section>

        </main>
    );
}