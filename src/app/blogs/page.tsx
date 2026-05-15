import { query } from '@/lib/database/db';
import JournalClient from './JournalClient';

export const revalidate = 60; // Revalidate cache every 60 seconds

export default async function JournalPage() {
    // Fetch only published blog posts, ordered by newest first
    const { rows } = await query(`
        SELECT * FROM blog_posts 
        WHERE published = true 
        ORDER BY published_at DESC
    `, []);

    // Map database snake_case to frontend camelCase
    const posts = rows.map((row: any) => ({
        _id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        coverImage: row.cover_image,
        author: row.author,
        tags: row.tags || [],
        publishedAt: row.published_at,
        createdAt: row.created_at,
    }));

    return (
        <JournalClient initialPosts={posts} />
    );
}


// "use client";

// import { useEffect, useState } from 'react';

// export default function JournalPage() {
//     const [activeTab, setActiveTab] = useState('All Stories');
//     const tabs = ['All Stories', 'Recaps', 'Interviews', 'Guides', 'Announcements'];

//     useEffect(() => {
//         // Smooth image reveal on load
//         const reveals = document.querySelectorAll('.img-reveal');
//         const timer = setTimeout(() => {
//             reveals.forEach(r => r.classList.add('active'));
//         }, 100);

//         // Scroll Reveal Animations
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

//         return () => {
//             clearTimeout(timer);
//             fadeElements.forEach(el => observer.unobserve(el));
//         };
//     }, []);

//     return (
//         <main className="w-full">
            
//             {/* HERO SECTION */}
//             <section className="relative w-full px-4 md:px-8 pt-28 pb-0 flex flex-col">
//                 <div className="relative w-full h-[40svh] md:h-[50svh] min-h-[350px] rounded-t-[2rem] overflow-hidden bg-brand-black img-reveal shadow-2xl img-wrapper flex items-center justify-center text-center">
                    
//                     <img 
//                         src="https://images.unsplash.com/photo-1549213713-52caee0428d6?q=80&w=1600&auto=format&fit=crop" 
//                         className="hero-img-anim absolute inset-0 w-full h-full object-cover filter grayscale-[40%] opacity-60" 
//                         alt="Journal Background" 
//                     />
//                     <div className="absolute inset-0 bg-brand-black/40"></div>
                    
//                     <div className="relative z-20 fade-up px-6 w-full flex flex-col items-center mt-8">
//                         <span className="inline-block text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-brand-black bg-brand-white px-5 py-2.5 rounded-full shadow-lg mb-4 md:mb-6">
//                             News & Editorials
//                         </span>
                        
//                         <h1 className="text-6xl md:text-8xl lg:text-[7vw] leading-none font-display font-extrabold uppercase tracking-tighter text-brand-white whitespace-nowrap">
//                             THE <span className="text-transparent [-webkit-text-stroke:1.5px_#FFFFFF] py-[0.15em] inline-block align-bottom">JOURNAL</span>
//                         </h1>
//                     </div>
//                 </div>
//             </section>

//             {/* MARQUEE SECTION */}
//             <div className="w-full bg-brand-accent border-y-4 border-brand-black overflow-hidden flex whitespace-nowrap py-3 md:py-4 z-20 relative">
//                 <div className="animate-marquee flex items-center w-[200%]">
//                     {/* First Set */}
//                     <div className="flex items-center w-1/2 justify-around text-brand-black">
//                         <span className="text-lg md:text-2xl font-display font-bold uppercase tracking-tighter">LATEST NEWS</span>
//                         <span className="text-xl md:text-3xl mx-4">•</span>
//                         <span className="text-lg md:text-2xl font-display font-bold uppercase tracking-tighter">EVENT RECAPS</span>
//                         <span className="text-xl md:text-3xl mx-4">•</span>
//                         <span className="text-lg md:text-2xl font-display font-bold uppercase tracking-tighter">ARTIST INTERVIEWS</span>
//                         <span className="text-xl md:text-3xl mx-4">•</span>
//                         <span className="text-lg md:text-2xl font-display font-bold uppercase tracking-tighter text-transparent [-webkit-text-stroke:1.5px_#0A0A0A] hover:text-brand-black transition-colors">STYLE GUIDES</span>
//                         <span className="text-xl md:text-3xl mx-4">•</span>
//                     </div>
//                     {/* Duplicate Set for infinite loop */}
//                     <div className="flex items-center w-1/2 justify-around text-brand-black">
//                         <span className="text-lg md:text-2xl font-display font-bold uppercase tracking-tighter">LATEST NEWS</span>
//                         <span className="text-xl md:text-3xl mx-4">•</span>
//                         <span className="text-lg md:text-2xl font-display font-bold uppercase tracking-tighter">EVENT RECAPS</span>
//                         <span className="text-xl md:text-3xl mx-4">•</span>
//                         <span className="text-lg md:text-2xl font-display font-bold uppercase tracking-tighter">ARTIST INTERVIEWS</span>
//                         <span className="text-xl md:text-3xl mx-4">•</span>
//                         <span className="text-lg md:text-2xl font-display font-bold uppercase tracking-tighter text-transparent [-webkit-text-stroke:1.5px_#0A0A0A] hover:text-brand-black transition-colors">STYLE GUIDES</span>
//                         <span className="text-xl md:text-3xl mx-4">•</span>
//                     </div>
//                 </div>
//             </div>

//             {/* EDITOR'S PICK SECTION */}
//             <section className="py-24 px-6 md:px-12 bg-brand-white border-b border-brand-border">
//                 <div className="max-w-[1600px] mx-auto">
                    
//                     <div className="mb-12 fade-up">
//                         <h2 className="text-4xl md:text-6xl font-display font-extrabold tracking-tighter uppercase text-brand-black">
//                             Editor's <span className="text-brand-gray text-transparent [-webkit-text-stroke:1.5px_#0A0A0A] hover:text-brand-black hover:[-webkit-text-stroke:0px] transition-all duration-400">Pick</span>
//                         </h2>
//                     </div>

//                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
//                         {/* Main Feature */}
//                         <a href="#" className="editorial-card lg:col-span-8 flex flex-col group fade-up">
//                             <div className="relative w-full aspect-video md:aspect-[16/9] lg:aspect-auto lg:h-[600px] rounded-2xl bg-brand-offwhite img-wrapper mb-6">
//                                 <img src="https://images.unsplash.com/photo-1514525253361-bee8a19740c1?q=80&w=1200&auto=format&fit=crop" alt="Featured Article" className="absolute inset-0 w-full h-full object-cover filter grayscale-[100%]" />
//                                 <div className="absolute top-6 left-6 z-10">
//                                     <span className="bg-brand-black text-brand-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg">Feature Story</span>
//                                 </div>
//                             </div>
//                             <div className="flex flex-col flex-1 pr-4">
//                                 <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-gray mb-3">May 15, 2024 • Event Recap</p>
//                                 <h3 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-brand-black leading-[0.95] mb-4 group-hover:text-brand-accent transition-colors">
//                                     The Evolution of Desi Nightlife in Australia
//                                 </h3>
//                                 <p className="text-sm md:text-base font-medium text-brand-gray leading-relaxed mb-6 line-clamp-2 max-w-3xl">
//                                     From underground basement parties to ruling the premier super-clubs of Sydney and Melbourne. Discover how Bollywood Club completely redefined the landscape of South Asian entertainment and what is coming next.
//                                 </p>
//                                 <div className="text-xs font-bold uppercase tracking-[0.15em] text-brand-black flex items-center">
//                                     Read Full Article <i className="fa-solid fa-arrow-right ml-2 arrow-icon text-lg"></i>
//                                 </div>
//                             </div>
//                         </a>

//                         {/* Side Articles */}
//                         <div className="lg:col-span-4 flex flex-col gap-8 md:gap-12 lg:gap-0 lg:justify-between fade-up" style={{ transitionDelay: '200ms' }}>
//                             <a href="#" className="editorial-card flex flex-col group">
//                                 <div className="relative w-full aspect-video rounded-xl bg-brand-offwhite img-wrapper mb-4 md:mb-5">
//                                     <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop" alt="Article Image" className="absolute inset-0 w-full h-full object-cover filter grayscale-[100%]" />
//                                     <div className="absolute top-4 left-4 z-10">
//                                         <span className="bg-brand-white text-brand-black px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full shadow-md">Interview</span>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-gray mb-2">May 02, 2024</p>
//                                     <h3 className="text-2xl font-display font-bold uppercase tracking-tighter text-brand-black leading-tight mb-2 group-hover:text-brand-accent transition-colors">
//                                         DJ Rink: Master of the Bollywood Beat
//                                     </h3>
//                                     <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-gray flex items-center mt-3">
//                                         Read <i className="fa-solid fa-arrow-right ml-2 arrow-icon"></i>
//                                     </div>
//                                 </div>
//                             </a>

//                             <a href="#" className="editorial-card flex flex-col group">
//                                 <div className="relative w-full aspect-video rounded-xl bg-brand-offwhite img-wrapper mb-4 md:mb-5">
//                                     <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop" alt="Article Image" className="absolute inset-0 w-full h-full object-cover filter grayscale-[100%]" />
//                                     <div className="absolute top-4 left-4 z-10">
//                                         <span className="bg-brand-white text-brand-black px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full shadow-md">Guide</span>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-gray mb-2">April 28, 2024</p>
//                                     <h3 className="text-2xl font-display font-bold uppercase tracking-tighter text-brand-black leading-tight mb-2 group-hover:text-brand-accent transition-colors">
//                                         The Ultimate VIP Table Survival Guide
//                                     </h3>
//                                     <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-gray flex items-center mt-3">
//                                         Read <i className="fa-solid fa-arrow-right ml-2 arrow-icon"></i>
//                                     </div>
//                                 </div>
//                             </a>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* THE ARCHIVES SECTION */}
//             <section className="py-24 px-6 md:px-12 bg-brand-offwhite">
//                 <div className="max-w-[1600px] mx-auto">
                    
//                     <div className="flex flex-col xl:flex-row justify-between items-end mb-16 fade-up">
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

//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
//                         {/* Grid Items */}
//                         {[
//                             { tag: "Guide", date: "April 05, 2024", title: "What to Wear: The White Affair Edition", desc: "Struggling to find the perfect outfit for our signature White Party? Here are some top fashion trends and tips to make sure you stand out on the dancefloor.", img: "1504608524841-42fe6f032b4b", delay: "0ms", bg: "bg-brand-black" },
//                             { tag: "News", date: "April 15, 2024", title: "Bollywood Club Officially Expanding to Asia", desc: "Get ready, Singapore! We are officially bringing the biggest Bollywood party to the heart of Southeast Asia. Secure your early bird access now.", img: "1533174072545-7a4b6ad7a6c3", delay: "100ms", bg: "bg-brand-accent" },
//                             { tag: "Recap", date: "March 22, 2024", title: "Melbourne's Fake Shaadi Chaos & Glory", desc: "We threw the biggest fake Indian wedding in Australia. From the dhol players to the barat, relive the absolute madness of this themed event.", img: "1492684223066-81342ee5ff30", delay: "200ms", bg: "bg-brand-black" },
//                             { tag: "Interview", date: "March 10, 2024", title: "Meet the Dancers Elevating the Experience", desc: "A behind-the-scenes look at the professional dance troupes that bring the authentic Bollywood cinematic energy directly to the club floor.", img: "1545128485-c400e7702796", delay: "0ms", bg: "bg-brand-black" },
//                             { tag: "Guide", date: "February 28, 2024", title: "How to Prep for Your First BC Event", desc: "Never been to a Bollywood Club party? From ticket booking to skipping the line, here is everything you need to know before you step inside.", img: "1511671782779-c97d3d27a1d4", delay: "100ms", bg: "bg-brand-black" },
//                             { tag: "Recap", date: "February 14, 2024", title: "The Valentine's Day Special: Love & Lights", desc: "Cupid met the club. An exclusive look at our sold-out Valentine's Day event featuring red carpets, roses, and romantic Bollywood remixes.", img: "1574160408544-672535091a18", delay: "200ms", bg: "bg-brand-black" },
//                         ].map((article, i) => (
//                             <a href="#" key={i} className="editorial-card flex flex-col group fade-up" style={{ transitionDelay: article.delay }}>
//                                 <div className="relative w-full aspect-[4/3] rounded-xl bg-brand-white img-wrapper mb-5">
//                                     <img src={`https://images.unsplash.com/photo-${article.img}?q=80&w=800&auto=format&fit=crop`} className="absolute inset-0 w-full h-full object-cover filter grayscale-[100%]" alt={article.title} />
//                                     <div className="absolute top-4 left-4 z-10">
//                                         <span className={`${article.bg} text-brand-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full`}>{article.tag}</span>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-gray mb-3">{article.date}</p>
//                                     <h3 className="text-2xl font-display font-bold uppercase tracking-tighter text-brand-black leading-tight mb-3 group-hover:text-brand-accent transition-colors">
//                                         {article.title}
//                                     </h3>
//                                     <p className="text-sm font-medium text-brand-gray leading-relaxed mb-5 line-clamp-2">
//                                         {article.desc}
//                                     </p>
//                                     <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-black flex items-center">
//                                         Read Article <i className="fa-solid fa-arrow-right ml-2 arrow-icon"></i>
//                                     </div>
//                                 </div>
//                             </a>
//                         ))}
//                     </div>

//                     <div className="mt-20 text-center fade-up">
//                         <button className="btn-outline px-12 py-5 rounded-full text-xs font-bold tracking-[0.15em] uppercase">
//                             Load More Stories
//                         </button>
//                     </div>

//                 </div>
//             </section>

//             {/* SUBSCRIBE SECTION */}
//             <section className="py-0 flex flex-col lg:flex-row bg-brand-white border-t border-brand-border">
//                 <div className="w-full lg:w-1/2 flex items-center justify-center p-12 lg:p-24 fade-up order-2 lg:order-1 border-r border-brand-border">
//                     <div className="w-full max-w-md">
//                         <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-accent mb-4 block">The Inner Circle</span>
//                         <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter uppercase text-brand-black mb-4">Stay In The Loop</h2>
//                         <p className="text-brand-gray font-medium text-sm mb-12 leading-relaxed">Subscribe to the journal to receive priority access to ticket drops, exclusive editorial content, and secret venue reveals delivered directly to your inbox.</p>
                        
//                         <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
//                             <div className="grid grid-cols-2 gap-6">
//                                 <div>
//                                     <input type="text" placeholder="FIRST NAME *" required className="w-full bg-transparent border-b border-brand-black pb-3 text-xs font-bold tracking-[0.15em] uppercase outline-none focus:border-brand-accent transition-colors text-brand-black placeholder-brand-gray" />
//                                 </div>
//                                 <div>
//                                     <input type="text" placeholder="LAST NAME" className="w-full bg-transparent border-b border-brand-black pb-3 text-xs font-bold tracking-[0.15em] uppercase outline-none focus:border-brand-accent transition-colors text-brand-black placeholder-brand-gray" />
//                                 </div>
//                             </div>
//                             <div>
//                                 <input type="email" placeholder="EMAIL ADDRESS *" required className="w-full bg-transparent border-b border-brand-black pb-3 text-xs font-bold tracking-[0.15em] uppercase outline-none focus:border-brand-accent transition-colors text-brand-black placeholder-brand-gray" />
//                             </div>
//                             <button type="submit" className="btn-monumental w-full py-5 text-xs font-bold tracking-[0.15em] uppercase mt-4">
//                                 <span>Subscribe</span>
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//                 <div className="w-full lg:w-1/2 aspect-square lg:aspect-auto relative img-reveal active order-1 lg:order-2 img-wrapper">
//                     <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover filter grayscale-[20%]" alt="Subscribe" />
//                 </div>
//             </section>
//         </main>
//     );
// }