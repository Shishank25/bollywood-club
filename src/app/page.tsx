"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { MediaAsset } from "@/lib/media"; 
import MediaSlot from "@/lib/media"; 

export default function HomePage() {
  const [media, setMedia] = useState<Record<string, MediaAsset>>({});
  const [isLoading, setIsLoading] = useState(true);

  const [events, setEvents] = useState<any[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(true);

  // Modal State
  const [ticketModalEventId, setTicketModalEventId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    f_name: '',
    l_name: '',
    email: '',
    phone: '',
  });
  const [citySelection, setCitySelection] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTicketModalEventId(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (ticketModalEventId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [ticketModalEventId]);

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

  // 2. Scroll reveal animations
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/v1/events?limit=4');
        if (res.ok) {
          const data = await res.json();
          const eventsArray = Array.isArray(data) ? data : (data.events || data.data || []);
          setEvents(eventsArray);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsEventsLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
          form_type: 'home_newsletter',
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

  const getVenueFromTitle = (title: string) => {
    if (!title) return "";
    const normalizedTitle = title.toLowerCase();
    if (normalizedTitle.includes("melbourne")) return "Crown L3";
    if (normalizedTitle.includes("sydney")) return "Barrio Cellar";
    return "";
  };

  return (
    <>
      {/* ── Ticket Modal ── */}
      {ticketModalEventId && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Reserve Tickets"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm"
            onClick={() => setTicketModalEventId(null)}
          />

          {/* Modal Panel */}
          <div className="relative z-10 w-full max-w-3xl bg-brand-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
               style={{ height: "min(85vh, 720px)" }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border shrink-0">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand-black">
                Reserve Tickets
              </span>
              <button
                onClick={() => setTicketModalEventId(null)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-brand-gray hover:text-brand-black hover:bg-brand-offwhite transition-colors"
                aria-label="Close modal"
              >
                <i className="fa-solid fa-xmark text-base" />
              </button>
            </div>

            {/* iFrame */}
            <div className="flex-1 relative bg-brand-offwhite">
              {/* Loading shimmer behind the iframe */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-brand-gray">
                  <div className="w-8 h-8 border-2 border-brand-gray/30 border-t-brand-black rounded-full animate-spin" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Loading</span>
                </div>
              </div>
              <iframe
                src={`https://147.79.70.30.nip.io:8444/events/frame/detail/${ticketModalEventId}`}
                title="Reserve Tickets"
                className="relative z-10 w-full h-full border-0"
                allow="payment"
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-brand-border shrink-0 flex items-center gap-2">
              <i className="fa-solid fa-lock text-[10px] text-brand-gray" />
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-brand-gray">
                Secure checkout powered by Tixmojo
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="relative h-[100svh] w-full flex flex-col justify-end px-6 md:px-12 pb-12 pt-32">
        <div className="absolute inset-0 top-[88px] bottom-6 left-6 right-6 rounded-[2rem] overflow-hidden bg-brand-offwhite img-reveal -z-10">
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
            <Link href="/vip" className="btn-outline px-10 py-4 rounded-full text-xs font-bold tracking-[0.15em] uppercase w-full sm:w-auto text-center">
              <span>VIP Access</span>
            </Link>
            <Link href="#events" className="btn-monumental px-10 py-4 rounded-full text-xs font-bold tracking-[0.15em] uppercase w-full sm:w-auto text-center">
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
            {isEventsLoading ? (
              <div className="col-span-full text-center text-brand-gray font-bold tracking-[0.15em] uppercase">
                Loading events...
              </div>
            ) : (
              events.map((event, index) => {
                const title = event.basicInfo?.name || event.title || "TBA";
                const venue = getVenueFromTitle(title);
                const image = event.media?.coverImage || event.img || "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop";
                const eventId = event._id;

                return (
                  <div 
                    key={eventId || index} 
                    className="group flex flex-col fade-up scale-hover justify-between flex-grow" 
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="w-full aspect-[3/4] overflow-hidden bg-brand-offwhite mb-4">
                      <img 
                        src={`https://tixmojo.com/wapi${image}`} 
                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" 
                        alt={`${title} flyer`} 
                      />
                    </div>
                    <div className="flex flex-col flex-1 justify-between">
                      <h3 className="text-2xl font-display font-bold uppercase tracking-tighter mb-1 text-wrap">{title}</h3>
                      <p className="text-sm font-medium text-brand-black mb-6 flex-1">{venue}</p>
                      {/* Reserve Tickets — opens modal with this event's ID */}
                      <button
                        onClick={() => setTicketModalEventId(eventId)}
                        className="btn-outline w-full py-3 rounded-full text-xs font-bold tracking-[0.15em] uppercase text-center"
                      >
                        Reserve Tickets
                      </button>
                    </div>
                  </div>
                );
              })
            )}
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
          {['cinematic-1', 'cinematic-2'].map((id) => (
            <div key={id} className="snap-center shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] aspect-video relative group cursor-pointer overflow-hidden bg-brand-offwhite/10">
              <MediaSlot id={id} mediaMap={media} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
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

          <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-12 fade-up" style={{ transitionDelay: "200ms" }}>
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
                <h3 className="text-2xl font-display font-bold uppercase tracking-tighter mb-4 border-b border-brand-border pb-4">{section.heading}</h3>
                <p className="text-base text-brand-gray leading-relaxed font-medium">{section.body}</p>
              </div>
            ))}
            <div>
              <h3 className="text-2xl font-display font-bold uppercase tracking-tighter mb-4 border-b border-brand-border pb-4">The Spectacle</h3>
              <p className="text-base text-brand-gray leading-relaxed font-medium mb-4">Our distinction lies in the immersive experiences we craft. Beyond the music, Bollywood Club delivers a visual spectacle featuring captivating live performances, state-of-the-art production, and bespoke VIP services. It is an elevated sensory journey designed for the discerning individual.</p>
              <p className="text-base text-brand-gray leading-relaxed font-medium">Join us at iconic global venues where the cinematic glamour of Bollywood meets the sophistication of premier entertainment destinations. Secure your access and become part of an exclusive community—your vibrant home away from home.</p>
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

            {formStatus === 'success' ? (
              <div className="bg-brand-black text-white p-8 text-center rounded-xl animate-in fade-in zoom-in duration-500">
                <h3 className="text-2xl font-display font-bold tracking-tighter uppercase mb-2">Welcome to the Club</h3>
                <p className="text-sm tracking-[0.1em] uppercase text-brand-gray">We'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-8">
                
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
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                    <i className="fa-solid fa-chevron-down text-brand-gray text-xs"></i>
                  </div>
                </div>

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
                  <span>{formStatus === 'loading' ? 'Submitting...' : 'Subscribe'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}