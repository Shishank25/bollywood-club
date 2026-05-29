"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LeadForm from "@/components/LeadForm"; 
import JsonRenderer from "@/components/JSONRenderer";

// Updated interface to include full text details for the modal
interface Offer {
  id: string;
  offer_title: string;
  short_description: string;
  thumbnail_url: string;
  category: string;
  expiry_date: string;
  // Updated to any/unknown to accept parsed JSON arrays or objects
  description?: any; 
  how_to_redeem?: any;
  terms_and_conditions?: any;
  offer_code?: string;
  offer_type?: string;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for the Modal
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  // Fetch Offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch('/api/offers'); 
        if (res.ok) {
          const data = await res.json();
          setOffers(data);
        }
      } catch (error) {
        console.error("Failed to fetch offers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Scroll Animations
  useEffect(() => {
    if (isLoading) return; 

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
      observer.disconnect();
    };
  }, [isLoading, offers]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedOffer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [selectedOffer]);

  // Add this function inside your OffersPage component (before the return statement)
    const handleOfferClick = async (baseOffer: Offer) => {
    try {
        // 1. Fetch the extra details and increment the click counter
        const res = await fetch(`/api/offers/${baseOffer.id}`);
        
        if (res.ok) {
        const extraDetails = await res.json();
        // 2. Merge the lightweight base offer with the new heavy text details
        setSelectedOffer({ ...baseOffer, ...extraDetails });
        } else {
        // Fallback: open modal with just the base info if the fetch fails
        setSelectedOffer(baseOffer);
        }
    } catch (error) {
        console.error("Failed to load offer details", error);
        setSelectedOffer(baseOffer);
    }
    };

  return (
    <main className="bg-brand-black min-h-screen mt-22 relative">

      {/* 1. MINIMAL BANNER */}
      <section className="py-6 text-center border-b border-white/10">
        <h1 className="text-3xl font-display font-extrabold uppercase tracking-tighter text-brand-white">
          Offers
        </h1>
      </section>

      {/* 2. HORIZONTAL SCROLLING OFFERS ROW */}
      <section className="py-16 sm:py-8 pl-4 sm:pl-8 md:pl-12 lg:pl-16 relative overflow-hidden">
        {isLoading ? (
          // Loading Skeleton Row
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[280px] md:min-w-[400px] aspect-[4/5] bg-brand-white/5 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : offers.length === 0 ? (
          // Empty State
          <div className="text-center py-20 pr-4 sm:pr-8 md:pr-12 lg:pr-16">
            <p className="text-brand-gray text-xs sm:text-sm tracking-widest uppercase font-bold">No active offers at the moment.</p>
          </div>
        ) : (
          // Offers Horizontal Scroll Container
          <div className="flex overflow-x-auto gap-6 sm:gap-8 pb-12 pr-4 sm:pr-8 md:pr-12 lg:pr-16 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {offers.map((offer, index) => (
              <div 
                key={offer.id} 
                onClick={() => handleOfferClick(offer)}
                className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[400px] flex flex-col group fade-up cursor-pointer"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Image Card */}
                <div className="aspect-[4/5] w-full rounded-xl overflow-hidden relative mb-4 sm:mb-6 bg-brand-white/5">
                  <img 
                    src={offer.thumbnail_url} 
                    alt={offer.offer_title}
                    className="absolute inset-0 w-full h-full object-cover filter grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  {/* Category Badge */}
                  {offer.category && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-brand-black/80 backdrop-blur-sm text-brand-white text-[8px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm">
                        {offer.category}
                      </span>
                    </div>
                  )}
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent opacity-80"></div>
                </div>

                {/* Text Content */}
                <div className="pr-4">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-display font-bold uppercase tracking-tighter text-brand-white mb-2 group-hover:text-transparent group-hover:[-webkit-text-stroke:1px_#FFFFFF] transition-colors duration-300">
                    {offer.offer_title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-brand-gray leading-relaxed font-medium mb-4 line-clamp-2">
                    {offer.short_description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                    <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-brand-white/50 font-bold">
                      Expires: {new Date(offer.expiry_date).toLocaleDateString()}
                    </span>
                    <button className="text-[9px] font-bold tracking-widest uppercase text-brand-white hover:text-brand-gray transition-colors">
                      View Details &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. CALL TO ACTION / FORM SECTION */}
      <section className="py-16 sm:py-24 lg:py-32 bg-brand-white px-4 sm:px-8 lg:px-12 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          
          <div className="w-full lg:w-1/2 fade-up">
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-display font-extrabold uppercase tracking-tighter leading-[0.9] text-brand-black mb-4 sm:mb-6">
              Never Miss <br />
              <span className="text-outline text-transparent [-webkit-text-stroke:1px_#0A0A0A]">An Offer</span>
            </h2>
            <p className="text-[10px] sm:text-xs md:text-sm lg:text-base font-medium text-brand-gray mb-8 sm:mb-12 max-w-md leading-relaxed">
              Sign up for our exclusive VIP list. Be the first to know about private events, table discounts, and complimentary guestlist drops.
            </p>

            <div className="max-w-md">
              <LeadForm 
                fields={['f_name', 'l_name', 'email', 'phone', 'city']} 
                formType="offer_signup"
                buttonText="Join the List"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2 aspect-square lg:aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden relative fade-up">
              <img 
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop" 
                className="w-full h-full object-cover filter grayscale-[20%]"
                alt="VIP Experience"
              />
              <div className="absolute inset-0 bg-brand-black/20 mix-blend-multiply"></div>
          </div>

        </div>
      </section>

      {/* 4. OFFER DETAILS MODAL */}
      {selectedOffer && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedOffer(null)}
        >
          <div 
            className="bg-brand-black border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col mt-22"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-brand-black/90 backdrop-blur-md z-10 p-6 sm:p-8 border-b border-white/10 flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {selectedOffer.category && (
                    <span className="text-[9px] font-bold tracking-widest uppercase text-brand-black bg-brand-white px-2.5 py-1 rounded-sm">
                      {selectedOffer.category}
                    </span>
                  )}
                  {selectedOffer.offer_type && (
                    <span className="text-[9px] font-bold tracking-widest uppercase text-brand-white/50 border border-white/20 px-2.5 py-1 rounded-sm">
                      {selectedOffer.offer_type}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-4xl font-display font-bold uppercase tracking-tighter text-brand-white leading-tight">
                  {selectedOffer.offer_title}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedOffer(null)}
                className="text-white/50 hover:text-white transition-colors p-2"
              >
                ✕
              </button>
            </div>

            {/* Modal Body (Text Only) */}
            <div className="p-6 sm:p-8 flex flex-col gap-8">
            
            {/* Description */}
            <div>
                <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-white/40 mb-3 border-b border-white/10 pb-2">Details</h4>
                <JsonRenderer content={selectedOffer.description || selectedOffer.short_description} />
            </div>

            <div className="flex flex-col gap-8">

                <div>
                    <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-white/40 mb-3 border-b border-white/10 pb-2">
                        Valid Until
                    </h4>
                    <p className="text-sm font-mono text-brand-white/80">
                        {new Date(selectedOffer.expiry_date)
                            .toISOString()
                            .replace('T', ' ')
                            .replace('.000Z', ' UTC')}
                    </p>
                </div>

                {/* How to Redeem */}
                {selectedOffer.how_to_redeem && (
                <div>
                    <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-white/40 mb-3 border-b border-white/10 pb-2">How to Redeem</h4>
                    <JsonRenderer content={selectedOffer.how_to_redeem} />
                </div>
                )}
                
                {/* Promo Code & Expiry (Unchanged) */}
                <div className="flex flex-col gap-6">
                {selectedOffer.offer_code && (
                    <div>
                    <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-white/40 mb-3 border-b border-white/10 pb-2">Promo Code</h4>
                    <div className="inline-block border border-dashed border-white/30 bg-white/5 px-4 py-2 rounded-sm text-lg font-mono text-brand-white tracking-wider">
                        {selectedOffer.offer_code}
                    </div>
                    </div>
                )}
                </div>
            </div>

            {/* Terms and Conditions */}
            {selectedOffer.terms_and_conditions && (
                <div>
                <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-white/40 mb-3 border-b border-white/10 pb-2">Terms & Conditions</h4>
                <JsonRenderer content={selectedOffer.terms_and_conditions} />
                </div>
            )}

            </div>
          </div>
        </div>
      )}

    </main>
  );
}

// Helper component to safely render JSONB content
// const JsonRenderer = ({ content }: { content: any }) => {
//   if (!content) return null;

//   // 1. Handle standard strings (legacy data or flat strings)
//   if (typeof content === 'string') {
//     return <p className="text-sm sm:text-base text-brand-gray/80 leading-relaxed font-medium">{content}</p>;
//   }

//   // 2. Handle Arrays (Great for step-by-step guides or bulleted T&Cs)
//   if (Array.isArray(content)) {
//     return (
//       <ul className="list-disc list-outside ml-4 space-y-2 text-sm sm:text-base text-brand-gray/80 leading-relaxed font-medium marker:text-white/30">
//         {content.map((item, index) => (
//           <li key={index}>
//             {typeof item === 'string' ? item : JSON.stringify(item)}
//           </li>
//         ))}
//       </ul>
//     );
//   }

//   // 3. Handle Rich Text Objects (Fallback for complex JSON structures)
//   // If you are using a specific editor like Slate or Editor.js, you would map their block types here.
//   return (
//     <pre className="text-xs text-brand-gray/60 whitespace-pre-wrap bg-white/5 p-4 rounded-sm border border-white/10 overflow-x-auto">
//       {JSON.stringify(content, null, 2)}
//     </pre>
//   );
// };