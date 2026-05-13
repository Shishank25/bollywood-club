"use client";

import { useEffect, useState } from 'react';

export default function EventsPage() {
    const [activeTab, setActiveTab] = useState('All Cities');
    const tabs = ['All Cities', 'Melbourne', 'Sydney', 'Singapore', 'Brisbane', 'Auckland'];
    
    // States for Hero Slider & Initial Reveal
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);

    const slides = [
        {
            date: "May 25, 2024 • Melbourne",
            title1: "P-POP",
            title2: "Weekender",
            img: "https://images.unsplash.com/photo-1541532713292-06987254f9f7?q=80&w=1600&auto=format&fit=crop"
        },
        {
            date: "May 30, 2024 • Sydney",
            title1: "Gulabo",
            title2: "Welcome",
            img: "https://images.unsplash.com/photo-1514525253361-bee8a19740c1?q=80&w=1600&auto=format&fit=crop"
        },
        {
            date: "June 05, 2024 • Singapore",
            title1: "Desi",
            title2: "House",
            img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1600&auto=format&fit=crop"
        }
    ];

    const events = [
        { title: "P-POP Weekender", date: "May 25, 2024", city: "Melbourne", venue: "Crown L3 Nightclub", img: "1541532713292-06987254f9f7", badge: "Selling Fast", delay: "0ms", active: true },
        { title: "Gulabo Welcome", date: "May 30, 2024", city: "Sydney", venue: "The Ivy Precinct", img: "1514525253361-bee8a19740c1", delay: "100ms", active: true },
        { title: "Desi House", date: "June 05, 2024", city: "Singapore", venue: "Marquee Marina Bay", img: "1533174072545-7a4b6ad7a6c3", delay: "200ms", active: true },
        { title: "Fake Shaadi", date: "June 12, 2024", city: "Brisbane", venue: "The Met", img: "1470225620780-dba8ba36b745", delay: "300ms", active: true },
        { title: "Neon Bollywood", date: "June 18, 2024", city: "Auckland", venue: "Studio The Venue", img: "1516450360452-9312f5e86fc7", delay: "0ms", active: true },
        { title: "White Affair", date: "June 25, 2024", city: "Adelaide", venue: "Hindley St Music Hall", img: "1504608524841-42fe6f032b4b", delay: "100ms", active: true },
        { title: "Retro Night", date: "July 02, 2024", city: "Perth", venue: "Metro City", img: "1549213713-52caee0428d6", delay: "200ms", active: true },
        { title: "Desi Swag", date: "Past Event", city: "Melbourne", venue: "Crown L3 Nightclub", img: "1492684223066-81342ee5ff30", badge: "Sold Out", delay: "300ms", active: false }
    ];

    // Trigger Image Reveal and Scroll Animations
    useEffect(() => {
        const revealTimer = setTimeout(() => setIsRevealed(true), 100);

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

    // Handle Slider Auto-Advance
    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(slideInterval);
    }, [slides.length]);

    const goToSlide = (index: number) => setCurrentSlide(index);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

    return (
        <main className="w-full selection:bg-brand-black selection:text-white">
            
            {/* HERO SLIDER SECTION */}
            <section className="relative h-[85svh] min-h-[600px] w-full px-6 md:px-12 pt-28 pb-12 flex flex-col">
                <div 
                    className={`relative w-full h-full rounded-[2rem] overflow-hidden bg-brand-black shadow-2xl transition-[clip-path] duration-[1200ms] ease-custom ${
                        isRevealed ? '[clip-path:polygon(0_0,_100%_0,_100%_100%,_0_100%)]' : '[clip-path:polygon(0_100%,_100%_100%,_100%_100%,_0_100%)]'
                    }`}
                >
                    {slides.map((slide, index) => (
                        <div 
                            key={index} 
                            className={`absolute inset-0 transition-all duration-1000 ease-custom ${
                                currentSlide === index ? 'opacity-100 visible z-10' : 'opacity-0 invisible z-0'
                            }`}
                        >
                            <img 
                                src={slide.img} 
                                alt={slide.title1}
                                className={`absolute inset-0 w-full h-full object-cover filter grayscale-[30%] opacity-80 transition-transform duration-[7000ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
                                    currentSlide === index ? 'scale-100' : 'scale-[1.15]'
                                }`} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/95 via-brand-black/40 to-transparent"></div>
                            
                            <div 
                                className={`absolute inset-0 flex flex-col justify-end pb-24 px-8 md:px-16 lg:px-24 z-20 transition-all duration-1000 ease-custom delay-200 ${
                                    currentSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
                                }`}
                            >
                                <div className="overflow-hidden mb-6">
                                    <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-brand-black bg-brand-white px-4 py-2 rounded-full">
                                        {slide.date}
                                    </span>
                                </div>
                                <h2 className="text-5xl md:text-7xl lg:text-[7vw] leading-[0.9] font-display font-extrabold uppercase tracking-tighter text-brand-white mb-8">
                                    {slide.title1} <br /> 
                                    <span className="text-brand-accent text-transparent [-webkit-text-stroke:1px_#FFFFFF]">
                                        {slide.title2}
                                    </span>
                                </h2>
                                
                                {/* Pure Tailwind Monumental Button */}
                                <a href="#event-grid" className="group relative overflow-hidden inline-flex items-center justify-center px-10 py-4 rounded-full text-xs font-bold tracking-[0.15em] uppercase w-fit bg-brand-white text-brand-black transition-colors duration-300">
                                    <div className="absolute top-full left-0 w-full h-full bg-brand-accent transition-all duration-500 ease-custom z-10 group-hover:top-0"></div>
                                    <span className="relative z-20 group-hover:text-white transition-colors duration-300">Reserve Tickets</span>
                                </a>
                            </div>
                        </div>
                    ))}

                    {/* Slider Controls */}
                    <div className="absolute bottom-8 left-8 md:left-16 lg:left-24 right-8 md:right-16 lg:right-24 flex justify-between items-end z-30 pointer-events-none">
                        <div className="flex space-x-2 pointer-events-auto pb-2">
                            {slides.map((_, i) => (
                                <button 
                                    key={i}
                                    onClick={() => goToSlide(i)}
                                    className={`h-1.5 rounded-full cursor-pointer transition-all duration-500 ease-custom ${
                                        currentSlide === i ? 'bg-white w-8' : 'bg-white/30 w-3'
                                    }`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>

                        <div className="flex gap-2 pointer-events-auto">
                            <button onClick={prevSlide} className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-brand-black transition-all">
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                            <button onClick={nextSlide} className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-brand-black transition-all">
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* EVENT GRID SECTION */}
            <section id="event-grid" className="pt-12 pb-32 bg-brand-white px-6 md:px-12">
                <div className="max-w-[1600px] mx-auto">
                    
                    {/* Filters */}
                    <div className="flex flex-col xl:flex-row justify-between items-end mb-16 fade-up">
                        <div className="mb-8 xl:mb-0">
                            <p className="text-sm font-bold tracking-[0.2em] uppercase text-brand-gray mb-2">Discover</p>
                            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase text-brand-black">All Events</h2>
                        </div>
                        
                        {/* Pure Tailwind Hide Scrollbar */}
                        <div className="flex space-x-8 overflow-x-auto w-full xl:w-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-[11px] font-bold tracking-[0.15em] uppercase text-brand-gray border-b border-brand-border">
                            {tabs.map((tab) => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 whitespace-nowrap transition-colors hover:text-brand-black ${
                                        activeTab === tab ? 'text-brand-black border-b-2 border-brand-black' : 'border-b-2 border-transparent'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
                        {events.map((event, i) => (
                            <div key={i} className="group flex flex-col fade-up" style={{ transitionDelay: event.delay }}>
                                <div className="w-full aspect-[3/4] overflow-hidden bg-brand-offwhite mb-6 relative">
                                    
                                    {/* Sold out overlay */}
                                    {!event.active && (
                                        <div className="absolute inset-0 bg-brand-black/20 z-10"></div>
                                    )}

                                    {/* Dynamic Badges */}
                                    {event.badge && (
                                        <div className={`absolute ${event.active ? 'top-4 left-4 bg-brand-accent text-white px-3 py-1.5' : 'inset-0 flex items-center justify-center'} z-20`}>
                                            <span className={`${!event.active && 'bg-brand-black text-brand-white px-4 py-2'} text-[10px] uppercase font-bold tracking-[0.2em]`}>
                                                {event.badge}
                                            </span>
                                        </div>
                                    )}

                                    <img 
                                        src={`https://images.unsplash.com/photo-${event.img}?q=80&w=800&auto=format&fit=crop`} 
                                        className={`w-full h-full object-cover filter transition-all duration-[800ms] ease-custom ${
                                            event.active ? 'grayscale group-hover:grayscale-0 group-hover:scale-105' : 'grayscale opacity-70'
                                        }`} 
                                        alt={event.title} 
                                    />
                                </div>
                                <div className={`flex flex-col flex-1 ${!event.active && 'opacity-60'}`}>
                                    <h3 className={`text-2xl font-display font-bold uppercase tracking-tighter mb-2 line-clamp-1 ${!event.active && 'text-brand-gray'}`}>
                                        {event.title}
                                    </h3>
                                    <p className={`text-xs font-bold tracking-[0.15em] uppercase mb-1 ${event.active ? 'text-brand-black' : 'text-brand-gray'}`}>
                                        {event.date}
                                    </p>
                                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-brand-gray mb-4">
                                        {event.city}
                                    </p>
                                    <p className={`text-sm font-medium mb-6 flex-1 ${event.active ? 'text-brand-black' : 'text-brand-gray'}`}>
                                        {event.venue}
                                    </p>
                                    
                                    {/* Conditional Button Styling */}
                                    {event.active ? (
                                        <a href="#" className="relative inline-flex items-center justify-center w-full py-3 rounded-full text-xs font-bold tracking-[0.15em] uppercase text-center bg-transparent text-brand-black border border-brand-black hover:bg-brand-black hover:text-white transition-all duration-300">
                                            Reserve Tickets
                                        </a>
                                    ) : (
                                        <button disabled className="w-full py-3 rounded-full text-xs font-bold tracking-[0.15em] uppercase text-center bg-brand-offwhite text-brand-gray cursor-not-allowed">
                                            Unavailable
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-24 text-center fade-up">
                        <a href="#" className="relative inline-flex items-center justify-center px-12 py-5 rounded-full text-xs font-bold tracking-[0.15em] uppercase bg-transparent text-brand-black border border-brand-black hover:bg-brand-black hover:text-white transition-all duration-300">
                            Load More Events
                        </a>
                    </div>
                    
                </div>
            </section>
        </main>
    );
}