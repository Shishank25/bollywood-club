"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MediaAsset } from "@/lib/media"; // Adjust this path if you saved your types elsewhere
import MediaSlot from "@/lib/media"; // Adjust this path based on where you saved the component

export default function BirthdayPage() {
  // 1. Media State
  const [media, setMedia] = useState<Record<string, MediaAsset>>({});
  const [isLoading, setIsLoading] = useState(true);

  // 2. Form State
  const [formData, setFormData] = useState({
    f_name: '',
    l_name: '',
    email: '',
    phone: '',
  });
  const [citySelection, setCitySelection] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Fetch Media
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

  // Scroll Animations
  useEffect(() => {
    if (isLoading) return; 

    const reveals = document.querySelectorAll(".img-reveal");
    const timer = setTimeout(() => {
      reveals.forEach((r) => r.classList.add("active"));
    }, 100);

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

  // 3. Handle Form Submission
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');

    const finalCity = citySelection === 'Other' ? customCity : citySelection;

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_type: 'birthday_lead', 
          f_name: formData.f_name,
          l_name: formData.l_name,
          email: formData.email,
          phone: formData.phone,
          city: finalCity
        })
      });

      if (res.ok) {
        setFormStatus('success');
        setFormData({ f_name: '', l_name: '', email: '', phone: '' });
        setCitySelection("");
        setCustomCity("");
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };

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
          desc: "Book now for exclusive birthday offers and make your special day a true sensation! Limited slots available.",
          delay: "200ms"
      }
  ];

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative w-full h-[85svh] min-h-[600px] flex flex-col justify-center items-center text-center px-4 md:px-8 pt-20">
          <img 
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1600&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 filter grayscale-[30%]" 
              alt="Birthday Celebration"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/80 via-brand-black/60 to-brand-black"></div>
          
          <div className="relative z-10 fade-up max-w-4xl mx-auto">
              <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-brand-black bg-brand-white px-5 py-2.5 rounded-full shadow-lg mb-6">
                  Celebrate With Us
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-[7vw] leading-[1] font-display font-extrabold uppercase tracking-tighter text-brand-white mb-6">
                  Your <br className="md:hidden" />
                  <span className="text-transparent [-webkit-text-stroke:1.5px_#FFFFFF] py-[0.15em] inline-block">Birthday</span>
                  <br className="hidden md:block" /> Masterpiece
              </h1>
              <p className="text-sm md:text-base font-medium text-brand-white/80 max-w-xl mx-auto leading-relaxed mb-10">
                  Transform your special day into a cinematic Bollywood experience. Premium VIP treatment, exclusive booths, and unforgettable memories.
              </p>
              <Link href="#inquire" className="btn-monumental px-12 py-5 rounded-full text-xs font-bold tracking-[0.15em] uppercase inline-block">
                  <span>Plan Your Night</span>
              </Link>
          </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 md:py-32 bg-brand-black px-6 md:px-12 border-t border-white/10">
          <div className="max-w-[1600px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
                  {features.map((feature) => (
                      <div key={feature.id} className="fade-up flex flex-col group" style={{ transitionDelay: feature.delay }}>
                          <span className="text-4xl md:text-5xl font-display font-bold text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.3)] group-hover:[-webkit-text-stroke:1px_#FFFFFF] transition-all duration-300 mb-6 block">
                              {feature.num}
                          </span>
                          <h3 className="text-xl md:text-2xl font-display font-bold uppercase tracking-tighter text-brand-white mb-4">
                              {feature.title}
                          </h3>
                          <p className="text-sm text-brand-gray leading-relaxed font-medium">
                              {feature.desc}
                          </p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* CALL TO ACTION / FORM SECTION */}
      <section id="inquire" className="py-24 md:py-32 bg-brand-white px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          <div className="w-full lg:w-1/2 fade-up">
            <h2 className="text-5xl md:text-7xl font-display font-extrabold uppercase tracking-tighter leading-[0.9] text-brand-black mb-6">
              Let's Make It <br />
              <span className="text-outline text-transparent [-webkit-text-stroke:1.5px_#0A0A0A]">Happen</span>
            </h2>
            <p className="text-sm md:text-base font-medium text-brand-gray mb-12 max-w-md leading-relaxed">
              Fill out the form below and our VIP concierge team will get back to you within 24 hours to plan your perfect celebration.
            </p>

            {/* FORM OR SUCCESS STATE */}
            {formStatus === 'success' ? (
                <div className="bg-brand-black text-white p-8 text-center rounded-xl animate-in fade-in zoom-in duration-500">
                    <h3 className="text-2xl font-display font-bold tracking-tighter uppercase mb-2">Request Received</h3>
                    <p className="text-sm tracking-[0.1em] uppercase text-brand-gray">Our concierge team will contact you shortly.</p>
                </div>
            ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-8 max-w-md">
                
                {formStatus === 'error' && (
                    <div className="text-red-500 text-xs font-bold uppercase tracking-widest">
                        An error occurred. Please try again.
                    </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                    <div className="border-b border-brand-black pb-2">
                    <input
                        type="text"
                        placeholder="FIRST NAME *"
                        value={formData.f_name}
                        onChange={(e) => setFormData({...formData, f_name: e.target.value})}
                        className="w-full bg-transparent text-xs font-bold tracking-[0.15em] uppercase placeholder-brand-gray focus:outline-none"
                        required
                    />
                    </div>
                    <div className="border-b border-brand-black pb-2">
                    <input
                        type="text"
                        placeholder="LAST NAME"
                        value={formData.l_name}
                        onChange={(e) => setFormData({...formData, l_name: e.target.value})}
                        className="w-full bg-transparent text-xs font-bold tracking-[0.15em] uppercase placeholder-brand-gray focus:outline-none"
                    />
                    </div>
                </div>

                <div className="border-b border-brand-black pb-2">
                    <input
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-transparent text-xs font-bold tracking-[0.15em] uppercase placeholder-brand-gray focus:outline-none"
                    required
                    />
                </div>

                <div className="border-b border-brand-black pb-2 flex items-center gap-4">
                    <span className="text-xs font-bold tracking-[0.15em] uppercase text-brand-black">+61</span>
                    <input
                    type="tel"
                    placeholder="PHONE NO. *"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-transparent text-xs font-bold tracking-[0.15em] uppercase placeholder-brand-gray focus:outline-none"
                    required
                    />
                </div>

                {/* THE NEW CITY DROPDOWN */}
                <div className="border-b border-brand-black pb-2 relative">
                    <select
                        value={citySelection}
                        onChange={(e) => setCitySelection(e.target.value)}
                        className={`w-full bg-transparent text-xs font-bold tracking-[0.15em] uppercase focus:outline-none appearance-none cursor-pointer ${citySelection === "" ? 'text-brand-gray' : 'text-brand-black'}`}
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
                    {/* Custom dropdown arrow */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                        <i className="fa-solid fa-chevron-down text-brand-gray text-xs"></i>
                    </div>
                </div>

                {/* Conditional Input for "Other" City */}
                {citySelection === 'Other' && (
                    <div className="border-b border-brand-black pb-2 animate-in slide-in-from-top-2 duration-300">
                        <input
                            type="text"
                            placeholder="ENTER YOUR CITY *"
                            value={customCity}
                            onChange={(e) => setCustomCity(e.target.value)}
                            className="w-full bg-transparent text-xs font-bold tracking-[0.15em] uppercase placeholder-brand-gray focus:outline-none"
                            required
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={formStatus === 'loading'}
                    className="btn-monumental w-full py-5 text-xs font-bold tracking-[0.15em] uppercase mt-4 disabled:opacity-50"
                >
                    <span>{formStatus === 'loading' ? 'Submitting...' : 'Submit Request'}</span>
                </button>
                </form>
            )}
          </div>

          <div className="w-full lg:w-1/2 aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden relative img-reveal img-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop" 
              className="w-full h-full object-cover filter grayscale-[20%]"
              alt="VIP Experience"
            />
          </div>

        </div>
      </section>

    </>
  );
}