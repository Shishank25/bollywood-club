"use client";

import { useEffect, useState } from 'react';

export default function ContactPage() {
    // ── State for the cinematic image reveal ──
    const [isRevealed, setIsRevealed] = useState(false);

    // ── Form State & API Routing ──
    const [formData, setFormData] = useState({
        f_name: '',
        l_name: '',
        email: '',
        phone: '',
        city: '',
        description: ''
    });
    const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('loading');

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    form_type: 'contact_inquiry', // Identifier for your DB
                    f_name: formData.f_name,
                    l_name: formData.l_name,
                    email: formData.email,
                    phone: formData.phone,
                    city: formData.city,
                    description: formData.description
                })
            });

            if (res.ok) {
                setFormStatus('success');
                // Reset form
                setFormData({
                    f_name: '',
                    l_name: '',
                    email: '',
                    phone: '',
                    city: '',
                    description: ''
                });
                
                // Return to idle state after 3 seconds
                setTimeout(() => setFormStatus('idle'), 3000);
            } else {
                setFormStatus('error');
            }
        } catch (error) {
            console.error("Submission error:", error);
            setFormStatus('error');
        }
    };

    const contactInfo = [
        {
            icon: "fa-solid fa-headset",
            title: "General Support",
            desc: "For ticketing and general event inquiries.",
            link: "mailto:info@bollywoodclubx.com",
            linkText: "info@bollywoodclubx.com",
            isLink: true
        },
        {
            icon: "fa-solid fa-crown",
            title: "VIP Bookings",
            desc: "Exclusive booth reservations and packages.",
            link: "tel:+61483952024",
            linkText: "+61 483952024",
            isLink: false
        },
        // {
        //     icon: "fa-solid fa-globe",
        //     title: "Asia Operations",
        //     desc: "For events and inquiries in Singapore.",
        //     link: "tel:+6531381490",
        //     linkText: "+65 31381490",
        //     isLink: false
        // }
    ];

    const faqs = [
        {
            question: "What is the dress code?",
            icon: "fa-solid fa-shirt",
            answer: "Smart club wear is strictly enforced. No hoodies, sportswear, torn jeans, or sneakers. Dress to impress for an elevated experience.",
            delay: "0ms"
        },
        {
            question: "ID Requirements",
            icon: "fa-solid fa-id-card",
            answer: "All events are strictly 18+. You must present a valid physical Driver's License, State ID, or Passport upon entry to the venue.",
            delay: "100ms"
        },
        {
            question: "Ticket Refunds",
            icon: "fa-solid fa-ticket",
            answer: "Tickets are non-refundable unless the event is cancelled or rescheduled. You can securely transfer tickets via our authorized ticketing partners.",
            delay: "200ms"
        }
    ];

    useEffect(() => {
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
            fadeElements.forEach(el => observer.unobserve(el));
        };
    }, []);

    return (
        <main className="w-full selection:bg-brand-black selection:text-white">
            
            {/* HERO SECTION */}
            <section className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 pb-6 sm:pb-8 md:pb-12 flex flex-col">
                <div 
                    className={`relative w-full h-[60vh] sm:h-[65vh] md:h-[65vh] min-h-[450px] sm:min-h-[500px] rounded-lg md:rounded-[2rem] overflow-hidden bg-brand-black shadow-2xl transition-[clip-path] duration-[1200ms] ease-custom ${
                        isRevealed ? '[clip-path:polygon(0_0,_100%_0,_100%_100%,_0_100%)]' : '[clip-path:polygon(0_100%,_100%_100%,_100%_100%,_0_100%)]'
                    }`}
                >
                    <img 
                        src="https://images.unsplash.com/photo-1576525865260-9f0e7cfb02b3?q=80&w=1600&auto=format&fit=crop" 
                        alt="Contact Us Background"
                        className={`absolute inset-0 w-full h-full object-cover filter grayscale-[30%] opacity-60 transition-transform duration-[10000ms] ease-out ${
                            isRevealed ? 'scale-100' : 'scale-[1.15]'
                        }`} 
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black/95 via-brand-black/40 to-brand-black/10"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-black/60 via-transparent to-transparent"></div>
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-12 lg:p-20 z-20">
                        <div className="fade-up max-w-4xl">
                            <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
                                <span className="inline-block text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-brand-black bg-brand-white px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full shadow-lg">
                                    Support & Inquiries
                                </span>
                                <span className="inline-block text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-brand-white bg-brand-accent px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full shadow-lg">
                                    24/7 Available
                                </span>
                            </div>
                            
                            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl leading-[1.1] font-display font-extrabold uppercase tracking-tighter text-brand-white">
                                Get In <br className="md:hidden" /> 
                                <span className="text-transparent [-webkit-text-stroke:1px_#FFFFFF] py-[0.15em] inline-block">Touch</span>
                            </h1>
                            
                            <p className="mt-3 md:mt-4 text-brand-white/80 text-[10px] sm:text-xs md:text-sm lg:text-base font-medium max-w-lg leading-relaxed border-l-2 border-brand-accent pl-3 md:pl-4">
                                We are here to ensure your night is flawless. Reach out for VIP booth reservations, corporate event planning, and exclusive ticket inquiries.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTACT INFO & FORM SECTION */}
            <section className="py-12 sm:py-16 md:py-24 px-3 sm:px-4 md:px-6 lg:px-12 bg-brand-white">
                <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 md:gap-16 lg:gap-24">
                    
                    {/* Left: Contact Info */}
                    <div className="lg:col-span-5 fade-up">
                        <div className="lg:sticky lg:top-32">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tighter uppercase leading-[0.9] text-brand-black mb-3 sm:mb-4 md:mb-6">
                                How Can We <br /> 
                                <span className="text-brand-gray text-transparent [-webkit-text-stroke:1px_#0A0A0A] hover:text-brand-black hover:[-webkit-text-stroke:0px] transition-all duration-400 cursor-default">Help?</span>
                            </h2>
                            <p className="text-[9px] sm:text-xs md:text-sm font-medium text-brand-gray leading-relaxed mb-6 sm:mb-8 md:mb-12 max-w-md">
                                Whether you have a question about an upcoming event, need assistance with tickets, or want to inquire about VIP services, our team is ready to assist you.
                            </p>

                            <div className="flex flex-col gap-3 sm:gap-4">
                                {contactInfo.map((info, i) => (
                                    <div 
                                        key={i} 
                                        className="group bg-brand-offwhite border border-transparent p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl md:rounded-2xl flex items-start gap-3 sm:gap-4 md:gap-5 lg:gap-6 cursor-pointer transition-all duration-[400ms] ease-custom hover:bg-brand-black hover:border-brand-black hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                                    >
                                        <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-brand-black mt-0.5 sm:mt-1 transition-colors duration-300 group-hover:text-brand-accent flex-shrink-0">
                                            <i className={info.icon}></i>
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-[9px] sm:text-xs md:text-sm font-bold tracking-[0.15em] uppercase text-brand-black mb-1 sm:mb-2 transition-colors duration-300 group-hover:text-white">
                                                {info.title}
                                            </h4>
                                            <p className="text-[8px] sm:text-[9px] md:text-xs text-brand-gray font-medium leading-relaxed mb-2 sm:mb-3 md:mb-4 transition-colors duration-300 group-hover:text-white/80">
                                                {info.desc}
                                            </p>
                                            {info.isLink ? (
                                                <a href={info.link} className="text-[8px] sm:text-[9px] md:text-xs font-bold text-brand-black underline underline-offset-4 decoration-brand-border hover:decoration-brand-black transition-colors duration-300 group-hover:text-white group-hover:decoration-white/40 group-hover:hover:decoration-white break-all">
                                                    {info.linkText}
                                                </a>
                                            ) : (
                                                <p className="text-[8px] sm:text-[9px] md:text-xs font-bold text-brand-black transition-colors duration-300 group-hover:text-white">
                                                    {info.linkText}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="lg:col-span-7 flex flex-col justify-center mt-8 lg:mt-0 fade-up" style={{ transitionDelay: '200ms' }}>
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold uppercase tracking-tighter text-brand-black mb-1 sm:mb-2">Send A Message</h3>
                        <p className="text-[8px] sm:text-[9px] md:text-xs font-bold tracking-[0.15em] uppercase text-brand-gray mb-6 sm:mb-8 md:mb-10 pb-4 sm:pb-6 border-b border-brand-border">We usually respond within 24 hours.</p>
                        
                        {formStatus === 'error' && (
                            <div className="mb-4 sm:mb-6 text-red-600 text-[8px] sm:text-[9px] md:text-xs font-bold uppercase tracking-widest border border-red-200 bg-red-50 p-3 sm:p-4 rounded-sm">
                                ⚠️ An error occurred. Please try submitting again.
                            </div>
                        )}

                        {formStatus === 'success' ? (
                            <div className="bg-brand-offwhite border border-brand-border p-8 sm:p-10 md:p-12 text-center flex flex-col items-center justify-center min-h-[300px] sm:min-h-[350px] md:min-h-[400px] rounded-lg">
                                <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-full bg-brand-black text-white flex items-center justify-center text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <h4 className="text-lg sm:text-xl md:text-2xl font-display font-bold uppercase tracking-tighter text-brand-black mb-1 sm:mb-2">Message Sent</h4>
                                <p className="text-[8px] sm:text-[9px] md:text-xs font-bold tracking-[0.15em] uppercase text-brand-gray">Our team will be in touch shortly.</p>
                            </div>
                        ) : (
                            <form className="space-y-6 sm:space-y-8 md:space-y-10" onSubmit={handleFormSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
                                    <div>
                                        <input 
                                            type="text" 
                                            placeholder="FIRST NAME *" 
                                            required 
                                            value={formData.f_name}
                                            onChange={(e) => setFormData({ ...formData, f_name: e.target.value })}
                                            className="w-full bg-transparent border-b border-brand-black pb-2 text-[8px] sm:text-[9px] md:text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" 
                                        />
                                    </div>
                                    <div>
                                        <input 
                                            type="text" 
                                            placeholder="LAST NAME" 
                                            value={formData.l_name}
                                            onChange={(e) => setFormData({ ...formData, l_name: e.target.value })}
                                            className="w-full bg-transparent border-b border-brand-black pb-2 text-[8px] sm:text-[9px] md:text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <input 
                                        type="email" 
                                        placeholder="EMAIL ADDRESS *" 
                                        required 
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-transparent border-b border-brand-black pb-2 text-[8px] sm:text-[9px] md:text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray rounded-none" 
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
                                    <div className="flex items-end border-b border-brand-black pb-2 transition-colors focus-within:border-brand-accent group">
                                        <div className="flex items-center gap-2 mr-2 sm:mr-3 md:mr-4 text-[8px] sm:text-[9px] md:text-xs font-bold tracking-widest text-brand-black">
                                            <span>+61</span>
                                        </div>
                                        <input 
                                            type="tel" 
                                            placeholder="PHONE NUMBER *" 
                                            required 
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-transparent text-[8px] sm:text-[9px] md:text-xs font-bold tracking-[0.15em] uppercase outline-none placeholder-brand-gray text-brand-black rounded-none" 
                                        />
                                    </div>
                                    
                                    <div className="relative">
                                        <select 
                                            required 
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className={`w-full bg-transparent border-b border-brand-black pb-2 text-[8px] sm:text-[9px] md:text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent appearance-none cursor-pointer pr-6 sm:pr-7 md:pr-8 rounded-none ${formData.city === '' ? 'text-brand-gray' : 'text-brand-black'}`}
                                        >
                                            <option value="" disabled className="text-brand-gray">SELECT CITY *</option>
                                            <option value="Melbourne">Melbourne</option>
                                            <option value="Sydney">Sydney</option>
                                            <option value="Brisbane">Brisbane</option>
                                            <option value="Perth">Perth</option>
                                            <option value="Adelaide">Adelaide</option>
                                            <option value="Auckland">Auckland</option>
                                            <option value="Singapore">Singapore</option>
                                        </select>
                                        <i className="fa-solid fa-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-[8px] sm:text-[9px] md:text-xs text-brand-black pointer-events-none"></i>
                                    </div>
                                </div>

                                <div>
                                    <textarea 
                                        required 
                                        rows={5} 
                                        placeholder="HOW CAN WE HELP YOU TODAY? *" 
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-transparent border-b border-brand-black pb-2 pt-2 text-[8px] sm:text-[9px] md:text-xs font-bold tracking-[0.15em] uppercase outline-none transition-colors duration-300 focus:border-brand-accent text-brand-black placeholder-brand-gray resize-none rounded-none"
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={formStatus === 'loading'}
                                    className="group relative overflow-hidden inline-flex items-center justify-center w-full py-4 sm:py-5 md:py-6 text-[8px] sm:text-[9px] md:text-xs font-bold tracking-[0.15em] uppercase mt-3 sm:mt-4 md:mt-4 bg-brand-black text-white transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <div className="absolute top-full left-0 w-full h-full bg-brand-accent transition-all duration-[400ms] ease-custom z-10 group-hover:top-0"></div>
                                    <span className="relative z-20">
                                        {formStatus === 'loading' ? 'Sending...' : 'Send Message'}
                                    </span>
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="py-12 sm:py-16 md:py-24 px-3 sm:px-4 md:px-6 lg:px-12 bg-brand-offwhite border-t border-brand-border">
                <div className="max-w-[1600px] mx-auto">
                    
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 sm:mb-12 md:mb-16 fade-up">
                        <div className="flex md:block max-w-2xl">
                            <h2 className="flex flex-col items-end text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tighter uppercase text-brand-black leading-[0.9]">
                                <span className="flex">
                                    <h3 className="text-[8px] sm:text-[9px] md:text-sm font-bold tracking-[0.2em] uppercase text-brand-gray mb-2 sm:mb-3 md:mb-4">FAQ</h3>
                                    <span>Quick</span>
                                </span> 
                                <span className="text-transparent [-webkit-text-stroke:1px_#0A0A0A]">Answers</span>
                            </h2>
                        </div>
                        <div className="mt-6 md:mt-0 max-w-sm">
                            <p className="text-sm font-medium text-brand-gray leading-relaxed">
                                Save time and find exactly what you're looking for with our most frequently asked questions.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {faqs.map((faq, i) => (
                            <div 
                                key={i} 
                                className="group bg-brand-offwhite border border-transparent p-8 md:p-10 rounded-2xl flex flex-col justify-between min-h-[250px] transition-all duration-[400ms] ease-custom hover:bg-brand-black hover:border-brand-black hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] fade-up"
                                style={{ transitionDelay: faq.delay }}
                            >
                                <div className="mb-6 flex justify-between items-start">
                                    <h4 className="text-base md:text-lg font-display font-bold uppercase tracking-tighter text-brand-black transition-colors duration-300 w-3/4 group-hover:text-white">
                                        {faq.question}
                                    </h4>
                                    <i className={`${faq.icon} text-brand-gray text-xl mt-1 transition-colors duration-300 group-hover:text-brand-accent`}></i>
                                </div>
                                <p className="text-xs text-brand-gray leading-relaxed font-medium transition-colors duration-300 group-hover:text-white/80">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

        </main>
    );
}