import { query } from '@/lib/database/db';
import GalleryClient from './GalleryClient';
import { GalleryPost } from '../api/admin/gallery/types';
import { MediaAsset } from '@/lib/media';

export const revalidate = 60; 

export default async function GalleryPage() {
    // 1. Fetch Dynamic Gallery Posts (The Grid)
    const postsQuery = query('SELECT * FROM gallery_posts ORDER BY display_order ASC', []);
    
    // 2. Fetch Fixed Media Slots (Hero & Aftermovie)
    const slotsQuery = query("SELECT * FROM \"MediaAssets\" WHERE page_route = '/gallery'", []);

    // Run both queries simultaneously for maximum performance
    const [{ rows: postRows }, { rows: slotRows }] = await Promise.all([postsQuery, slotsQuery]);

    // Map the media slots to a dictionary object: { "hero-video": { ...assetData } }
    const mediaSlots = Object.fromEntries(
        (slotRows as MediaAsset[]).map((asset) => [asset.html_id, asset])
    );

    return (
        <GalleryClient 
            initialPosts={postRows as GalleryPost[]} 
            mediaSlots={mediaSlots} // This was missing! 
        />
    );
}

// "use client";

// import { useEffect, useState } from 'react';

// export default function GalleryPage() {
//     const [activeTab, setActiveTab] = useState('All Media');
//     const tabs = ['All Media', 'Photos', 'Videos', 'Melbourne', 'Sydney', 'Singapore'];

//     useEffect(() => {
//         // Smooth image reveal on load
//         const reveals = document.querySelectorAll('.img-reveal');
//         const timer = setTimeout(() => {
//             reveals.forEach(r => r.classList.add('active'));
//         }, 100);

//         // Scroll Reveal Animations using Intersection Observer
//         const fadeElements = document.querySelectorAll('.fade-up');
//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add('active');
//                     observer.unobserve(entry.target);
//                 }
//             });
//         }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

//         fadeElements.forEach(el => observer.observe(el));

//         // Cleanup
//         return () => {
//             clearTimeout(timer);
//             fadeElements.forEach(el => observer.unobserve(el));
//         };
//     }, []);

//     return (
//         <main className="w-full">
//             {/* HERO SECTION */}
//             <section className="relative w-full px-4 md:px-8 pt-28 pb-12 flex flex-col">
//                 <div className="relative w-full h-auto min-h-[500px] rounded-[2rem] overflow-hidden bg-brand-black img-reveal shadow-2xl img-wrapper">
//                     <img 
//                         src="https://images.unsplash.com/photo-1549213713-52caee0428d6?q=80&w=1600&auto=format&fit=crop" 
//                         className="hero-img-anim absolute inset-0 w-full h-full object-cover filter grayscale-[20%] opacity-60" 
//                         alt="Hero Background"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-brand-black/95 via-brand-black/40 to-transparent"></div>
                    
//                     <div className="inset-0 flex flex-col justify-end p-8 md:p-16 z-20">
//                         <div className="fade-up max-w-4xl text-center mx-auto">
//                             <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-brand-black bg-brand-white px-5 py-2.5 rounded-full shadow-lg mb-6">
//                                 Captured Moments
//                             </span>
//                             <h1 className="text-5xl md:text-7xl lg:text-[7.5vw] leading-[1.1] font-display font-extrabold uppercase tracking-tighter text-brand-white py-2">
//                                 Relive The <br className="md:hidden" /> 
//                                 <span className="text-transparent [-webkit-text-stroke:1.5px_#FFFFFF] py-[0.15em] inline-block">
//                                     Magic
//                                 </span>
//                             </h1>
//                             <p className="mt-4 text-brand-white/80 text-sm md:text-base font-medium max-w-lg mx-auto leading-relaxed">
//                                 Immerse yourself in the ultimate Bollywood nightlife experience.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* LATEST AFTERMOVIE SECTION */}
//             <section className="pt-12 pb-24 px-6 md:px-12 bg-brand-white">
//                 <div className="max-w-[1600px] mx-auto fade-up">
//                     <div className="flex justify-between items-end mb-8">
//                         <div>
//                             <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-accent mb-2">Featured</p>
//                             <h2 className="text-3xl text- md:text-5xl font-display font-bold tracking-tighter uppercase text-brand-black">
//                                 Latest <span className='bg-black text-white px-2'>Aftermovie</span>
//                             </h2>
//                         </div>
//                         <button className="hidden md:flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-brand-gray hover:text-brand-black transition-colors">
//                             View All <i className="fa-solid fa-arrow-right"></i>
//                         </button>
//                     </div>

//                     <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden relative group cursor-pointer bg-brand-offwhite scale-hover img-wrapper">
//                         <img 
//                             src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop" 
//                             className="w-full h-full object-cover filter grayscale-[10%]" 
//                             alt="Video Thumbnail" 
//                         />
//                         <div className="absolute inset-0 bg-brand-black/30 group-hover:bg-brand-black/10 transition-colors duration-500"></div>
                        
//                         <div className="absolute inset-0 flex items-center justify-center z-10">
//                             <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-brand-black transition-all duration-500">
//                                 <i className="fa-solid fa-play ml-1 md:ml-2 text-2xl md:text-3xl"></i>
//                             </div>
//                         </div>

//                         <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10">
//                             <div>
//                                 <h3 className="text-white font-display font-bold text-2xl md:text-4xl uppercase tracking-tighter drop-shadow-md">P-POP Weekender</h3>
//                                 <p className="text-white/80 text-xs font-bold tracking-[0.15em] uppercase drop-shadow-md mt-1">Melbourne • Crown L3</p>
//                             </div>
//                             <span className="bg-brand-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/20">03:45</span>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* THE ARCHIVES SECTION */}
//             <section id="all-media" className="pb-32 px-6 md:px-12 bg-brand-white border-t border-brand-border pt-24">
//                 <div className="max-w-[1600px] mx-auto">
                    
//                     <div className="flex flex-col xl:flex-row justify-between items-end mb-12 fade-up">
//                         <div className="mb-8 xl:mb-0">
//                             <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter uppercase text-brand-black">The Archives</h2>
//                         </div>
                        
//                         <div className="flex space-x-8 overflow-x-auto w-full xl:w-auto pb-4 hide-scroll text-[11px] font-bold tracking-[0.15em] uppercase text-brand-gray border-b border-brand-border">
//                             {tabs.map((tab) => (
//                                 <button 
//                                     key={tab}
//                                     onClick={() => setActiveTab(tab)}
//                                     className={`filter-tab pb-4 whitespace-nowrap transition-colors hover:text-brand-black ${
//                                         activeTab === tab ? 'active text-brand-black border-b-2 border-brand-black' : 'border-b-2 border-transparent'
//                                     }`}
//                                 >
//                                     {tab}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[320px] fade-up" style={{ transitionDelay: '100ms' }}>
                        
//                         {/* Gallery Item 1 */}
//                         <div className="gallery-item relative overflow-hidden bg-brand-offwhite md:col-span-2 md:row-span-2 group scale-hover img-wrapper rounded-xl">
//                             <img src="https://images.unsplash.com/photo-1541532713292-06987254f9f7?q=80&w=1200&auto=format&fit=crop" alt="Party Crowd" />
//                             <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent gallery-overlay"></div>
//                             <div className="absolute top-6 left-6 z-20">
//                                 <span className="bg-brand-white text-brand-black text-[9px] font-bold px-3 py-1.5 uppercase tracking-widest rounded-full">Photo Album</span>
//                             </div>
//                             <div className="absolute bottom-6 left-6 right-6 z-20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
//                                 <h3 className="text-3xl font-display font-bold text-white uppercase tracking-tighter mb-1">White Affair</h3>
//                                 <p className="text-xs font-bold tracking-[0.15em] uppercase text-brand-accent">Melbourne • 150+ Photos</p>
//                             </div>
//                         </div>

//                         {/* Gallery Item 2 */}
//                         <div className="gallery-item relative overflow-hidden bg-brand-offwhite col-span-1 row-span-1 group scale-hover img-wrapper rounded-xl">
//                             <img src="https://images.unsplash.com/photo-1514525253361-bee8a19740c1?q=80&w=800&auto=format&fit=crop" alt="DJ Set" />
//                             <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent gallery-overlay"></div>
//                             <div className="absolute inset-0 flex items-center justify-center z-20 gallery-play-btn">
//                                 <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white">
//                                     <i className="fa-solid fa-play ml-1"></i>
//                                 </div>
//                             </div>
//                             <div className="absolute bottom-6 left-6 z-20">
//                                 <h3 className="text-xl font-display font-bold text-white uppercase tracking-tighter mb-1">DJ Lineup</h3>
//                                 <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-brand-accent">Sydney</p>
//                             </div>
//                         </div>

//                         {/* Gallery Item 3 */}
//                         <div className="gallery-item relative overflow-hidden bg-brand-offwhite col-span-1 md:row-span-2 group scale-hover img-wrapper rounded-xl">
//                             <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop" alt="Dancers" />
//                             <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/20 to-transparent gallery-overlay"></div>
//                             <div className="absolute top-6 left-6 z-20">
//                                 <span className="bg-brand-white text-brand-black text-[9px] font-bold px-3 py-1.5 uppercase tracking-widest rounded-full">Photo Album</span>
//                             </div>
//                             <div className="absolute bottom-6 left-6 z-20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
//                                 <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tighter mb-1">Desi Vibes</h3>
//                                 <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-brand-accent">Singapore • 80 Photos</p>
//                             </div>
//                         </div>

//                         {/* Gallery Item 4 */}
//                         <div className="gallery-item relative overflow-hidden bg-brand-offwhite md:col-span-2 row-span-1 group scale-hover img-wrapper rounded-xl">
//                             <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop" alt="Stage Lights" />
//                             <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent gallery-overlay"></div>
//                             <div className="absolute top-6 left-6 z-20">
//                                 <span className="bg-brand-accent text-brand-white text-[9px] font-bold px-3 py-1.5 uppercase tracking-widest rounded-full">Video Recap</span>
//                             </div>
//                             <div className="absolute inset-0 flex items-center justify-center z-20 gallery-play-btn">
//                                 <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white">
//                                     <i className="fa-solid fa-play ml-1"></i>
//                                 </div>
//                             </div>
//                             <div className="absolute bottom-6 left-6 z-20">
//                                 <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tighter mb-1">Mainstage Highlights</h3>
//                                 <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-brand-white/70">Brisbane</p>
//                             </div>
//                         </div>

//                         {/* Gallery Item 5 */}
//                         <div className="gallery-item relative overflow-hidden bg-brand-offwhite col-span-1 row-span-1 group scale-hover img-wrapper rounded-xl">
//                             <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop" alt="VIP Bottles" />
//                             <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent gallery-overlay"></div>
//                             <div className="absolute bottom-6 left-6 z-20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
//                                 <h3 className="text-xl font-display font-bold text-white uppercase tracking-tighter mb-1">VIP Tables</h3>
//                                 <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-brand-accent">Perth</p>
//                             </div>
//                         </div>
                        
//                         {/* Gallery Item 6 */}
//                         <div className="gallery-item relative overflow-hidden bg-brand-offwhite col-span-1 row-span-1 group scale-hover img-wrapper rounded-xl">
//                             <img src="https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=800&auto=format&fit=crop" alt="Crowd" />
//                             <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent gallery-overlay"></div>
//                             <div className="absolute bottom-6 left-6 z-20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
//                                 <h3 className="text-xl font-display font-bold text-white uppercase tracking-tighter mb-1">Fake Shaadi</h3>
//                                 <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-brand-accent">Auckland</p>
//                             </div>
//                         </div>

//                     </div>

//                     <div className="mt-20 text-center fade-up">
//                         <button className="btn-outline px-12 py-5 rounded-full text-xs font-bold tracking-[0.15em] uppercase">
//                             Load More Memories
//                         </button>
//                     </div>
//                 </div>
//             </section>

//             {/* FOLLOW THE VIBE SECTION */}
//             <section className="py-24 bg-brand-black text-brand-white px-6 md:px-12 border-t border-brand-border/20">
//                 <div className="max-w-[1600px] mx-auto">
//                     <div className="flex flex-col md:flex-row justify-between items-end mb-12 fade-up">
//                         <div>
//                             <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase mb-2">Follow The Vibe</h2>
//                             <p className="text-sm font-medium text-brand-gray">Tag @BollywoodClub to be featured.</p>
//                         </div>
//                         <a href="#" className="mt-6 md:mt-0 flex items-center gap-3 text-xs font-bold tracking-[0.15em] uppercase text-brand-accent hover:text-white transition-colors">
//                             <i className="fa-brands fa-instagram text-lg"></i> Follow Us
//                         </a>
//                     </div>

//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-up">
//                         <div className="aspect-square bg-brand-offwhite/10 rounded-lg overflow-hidden group cursor-pointer relative">
//                             <img src="https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Instagram 1" />
//                             <div className="absolute inset-0 bg-brand-accent/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-3xl">
//                                 <i className="fa-brands fa-instagram"></i>
//                             </div>
//                         </div>
//                         <div className="aspect-square bg-brand-offwhite/10 rounded-lg overflow-hidden group cursor-pointer relative">
//                             <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Instagram 2" />
//                             <div className="absolute inset-0 bg-brand-accent/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-3xl">
//                                 <i className="fa-brands fa-instagram"></i>
//                             </div>
//                         </div>
//                         <div className="aspect-square bg-brand-offwhite/10 rounded-lg overflow-hidden group cursor-pointer relative hidden md:block">
//                             <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Instagram 3" />
//                             <div className="absolute inset-0 bg-brand-accent/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-3xl">
//                                 <i className="fa-brands fa-instagram"></i>
//                             </div>
//                         </div>
//                         <div className="aspect-square bg-brand-offwhite/10 rounded-lg overflow-hidden group cursor-pointer relative hidden md:block">
//                             <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Instagram 4" />
//                             <div className="absolute inset-0 bg-brand-accent/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-3xl">
//                                 <i className="fa-brands fa-instagram"></i>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </main>
//     );
// }