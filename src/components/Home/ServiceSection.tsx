"use client";

import { useEffect, useRef } from "react";

// ─── CSS Art ──────────────────────────────────────────────────────────────────

function DiscoBall() {
  return (
    <div className="svc-art-frame">
      <div className="svc-glow svc-glow-accent" />
      <div className="disco-ball-wrapper">
        <div className="disco-string" />
        <div className="disco-ball">
          <div className="disco-tiles">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="disco-tile" style={{ animationDelay: `${(i * 0.07) % 2}s` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VipBadge() {
  return (
    <div className="svc-art-frame">
      <div className="svc-glow svc-glow-gold" />
      <div className="vip-badge-wrapper">
        <div className="vip-badge">
          <span className="badge-eyebrow">Exclusive Access</span>
          <span className="badge-vip-text">VIP</span>
          <div className="badge-rule" />
          <div className="badge-avatar" />
          <span className="badge-name">Distinguished</span>
          <div className="badge-shine" />
        </div>
      </div>
    </div>
  );
}

function BirthdayCake() {
  return (
    <div className="svc-art-frame">
      <div className="svc-glow svc-glow-accent" />
      <div className="cake-wrapper">
        <div className="cake">
          <div className="cake-layer cake-layer-3">
            <div className="frosting" />
            <div className="candles">
              {[0, 1, 2].map((i) => (
                <div key={i} className="candle">
                  <div className="flame" style={{ animationDelay: `${i * 0.22}s` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="cake-layer cake-layer-2"><div className="frosting" /></div>
          <div className="cake-layer cake-layer-1"><div className="frosting" /></div>
        </div>
      </div>
    </div>
  );
}

function ChampagneGlass() {
  return (
    <div className="svc-art-frame">
      <div className="svc-glow svc-glow-gold" />
      <div className="champ-wrapper">
        <div className="champ-glass">
          <div className="champ-bowl">
            <div className="champ-liquid" />
            <div className="champ-bubbles">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="champ-bubble" style={{ left: `${20 + i * 20}%`, animationDelay: `${i * 0.45}s` }} />
              ))}
            </div>
          </div>
          <div className="champ-stem" />
          <div className="champ-base" />
        </div>
      </div>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: "corporate",
    accentClass: "text-brand-accent",
    label: "Corporate Excellence",
    heading: ["Elevate Your", "Corporate Events"],
    body: "Transform your business gatherings into powerful experiences that inspire, connect, and leave lasting impressions on every guest.",
    features: [
      { icon: "fa-solid fa-check-circle", text: "Bespoke event design & production", gold: false },
      { icon: "fa-solid fa-check-circle", text: "Premium venue partnerships", gold: false },
    ],
    cta: "Explore Corporate",
    Art: DiscoBall,
    flip: false,
  },
  {
    id: "vip",
    accentClass: "text-brand-gold",
    label: "Exclusive Access",
    heading: ["VIP", "Reservations"],
    body: "Skip the ordinary. Our VIP services grant you access to the most sought-after tables and private lounges. Your status, elevated.",
    features: [
      { icon: "fa-solid fa-star", text: "Priority booking at premium venues", gold: true },
      { icon: "fa-solid fa-star", text: "Dedicated concierge service", gold: true },
    ],
    cta: "Reserve VIP",
    Art: VipBadge,
    flip: true,
  },
  {
    id: "birthday",
    accentClass: "text-brand-accent",
    label: "Celebrate in Style",
    heading: ["Birthday", "Experiences"],
    body: "Make your special day truly extraordinary. From intimate dinners to grand celebrations, we craft memories that last for years to come.",
    features: [
      { icon: "fa-solid fa-gift", text: "Custom themed celebrations", gold: false },
      { icon: "fa-solid fa-gift", text: "1+1 Complimentary Tickets", gold: false },
    ],
    cta: "Plan Birthday",
    Art: BirthdayCake,
    flip: false,
  },
  {
    id: "private",
    accentClass: "text-brand-gold",
    label: "Intimate Gatherings",
    heading: ["Private", "Events"],
    body: "Our private event services ensure complete discretion, impeccable attention to detail, and an atmosphere of refined elegance.",
    features: [
      { icon: "fa-solid fa-champagne-glasses", text: "Complete privacy assured", gold: true },
      { icon: "fa-solid fa-champagne-glasses", text: "White-glove service", gold: true },
    ],
    cta: "Inquire Private",
    Art: ChampagneGlass,
    flip: true,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ServicesSection() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll(".svc-reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("svc-in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    items.forEach((i) => obs.observe(i));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* ── Reveal ── */
        .svc-reveal { opacity:0; transform:translateY(26px); transition:opacity .75s ease,transform .75s ease; }
        .svc-reveal.svc-scale { transform:scale(0.9); }
        .svc-reveal.svc-in { opacity:1; transform:translate(0) scale(1); }
        .svc-d1 { transition-delay:100ms; }
        .svc-d2 { transition-delay:210ms; }
        .svc-d3 { transition-delay:330ms; }
        .svc-d4 { transition-delay:450ms; }

        /* ── Art frame ── */
        .svc-art-frame {
          position:relative; display:flex; justify-content:center; align-items:center;
          height:250px; width:100%;
          animation:svcFloat 6s ease-in-out infinite;
        }
        @media(min-width:1024px){ .svc-art-frame{ height:370px; } }
        @keyframes svcFloat{ 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-13px); } }

        /* ── Glow ── */
        .svc-glow{
          position:absolute; width:190px; height:190px; border-radius:50%;
          filter:blur(65px); z-index:0; animation:svcPulse 4s alternate infinite;
        }
        @media(min-width:1024px){ .svc-glow{ width:300px; height:300px; } }
        .svc-glow-accent{ background:#FF2E93; opacity:.22; }
        .svc-glow-gold  { background:#D4AF37; opacity:.18; }
        @keyframes svcPulse{ 0%{ opacity:.12; transform:scale(.8); } 100%{ opacity:.38; transform:scale(1.15); } }

        /* ── Disco ball ── */
        .disco-ball-wrapper{ position:relative; width:150px; height:150px; z-index:1; }
        @media(min-width:1024px){ .disco-ball-wrapper{ width:245px; height:245px; } }
        .disco-string{ position:absolute; top:-44px; left:50%; transform:translateX(-50%); width:2px; height:44px; background:rgba(255,255,255,.22); }
        .disco-ball{
          width:100%; height:100%; border-radius:50%;
          background:linear-gradient(135deg,#E8E8E8 0%,#888 25%,#D0D0D0 50%,#666 75%,#C8C8C8 100%);
          position:relative; animation:svcSpin 22s linear infinite; overflow:hidden;
          box-shadow:0 0 50px rgba(255,46,147,.35),inset 0 0 40px rgba(255,255,255,.55);
        }
        @keyframes svcSpin{ from{ transform:rotate(0); } to{ transform:rotate(360deg); } }
        .disco-tiles{
          position:absolute; inset:0;
          display:grid; grid-template-columns:repeat(12,1fr); grid-template-rows:repeat(12,1fr);
          gap:1px; padding:4px; border-radius:50%; overflow:hidden;
        }
        .disco-tile{ background:linear-gradient(135deg,rgba(255,255,255,.8),rgba(150,150,150,.4)); border-radius:1px; animation:svcShimmer 1.8s ease-in-out infinite; }
        .disco-tile:nth-child(odd){ animation-delay:.5s; }
        .disco-tile:nth-child(3n){ animation-delay:1s; }
        @keyframes svcShimmer{ 0%,100%{ opacity:.25; } 50%{ opacity:1; background:#FF2E93; } }

        /* ── VIP badge ── */
        .vip-badge-wrapper{
          position:relative; width:148px; height:208px; z-index:1;
          transform-style:preserve-3d; animation:svcTilt 6s ease-in-out infinite alternate;
        }
        @media(min-width:1024px){ .vip-badge-wrapper{ width:208px; height:288px; } }
        @keyframes svcTilt{ 0%{ transform:perspective(1000px) rotateY(-14deg) rotateX(5deg); } 100%{ transform:perspective(1000px) rotateY(14deg) rotateX(-5deg); } }
        .vip-badge{
          width:100%; height:100%;
          background:linear-gradient(145deg,#1A1A1A 0%,#050505 50%,#1A1A1A 100%);
          border-radius:12px; border:1px solid #D4AF37;
          display:flex; flex-direction:column; align-items:center;
          padding:1.5rem 1rem; position:relative; overflow:hidden;
          box-shadow:0 20px 50px rgba(0,0,0,.9),0 0 25px rgba(212,175,55,.2);
        }
        .badge-shine{ position:absolute; top:-50%; left:-40%; width:80%; height:200%; background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.06) 50%,transparent 60%); animation:svcShine 4s ease-in-out infinite; }
        @keyframes svcShine{ 0%,100%{ left:-40%; } 50%{ left:100%; } }
        .badge-eyebrow{ font-size:.4rem; letter-spacing:.2em; text-transform:uppercase; color:#D4AF37; margin-bottom:.5rem; }
        .badge-vip-text{ font-size:2.5rem; font-family:'Syne',sans-serif; font-weight:800; color:#D4AF37; text-shadow:0 0 18px rgba(212,175,55,.5); line-height:1; margin-bottom:.5rem; }
        .badge-rule{ width:60%; height:1px; background:#D4AF37; margin:.4rem 0; opacity:.45; }
        .badge-avatar{ width:48px; height:48px; border-radius:50%; border:1px solid #D4AF37; background:#222; margin-bottom:.5rem; position:relative; overflow:hidden; }
        .badge-avatar::after{ content:''; position:absolute; bottom:-8px; left:50%; transform:translateX(-50%); width:30px; height:20px; background:#444; border-radius:50% 50% 0 0; }
        .badge-avatar::before{ content:''; position:absolute; top:10px; left:50%; transform:translateX(-50%); width:14px; height:14px; background:#444; border-radius:50%; z-index:1; }
        .badge-name{ font-size:.55rem; letter-spacing:.1em; color:#fff; font-weight:600; text-transform:uppercase; }

        /* ── Cake ── */
        .cake-wrapper{ position:relative; width:172px; height:192px; z-index:1; }
        @media(min-width:1024px){ .cake-wrapper{ width:236px; height:256px; } }
        .cake{ position:absolute; bottom:0; width:100%; }
        .cake-layer{ margin:0 auto; border-radius:6px 6px 10px 10px; position:relative; }
        .cake-layer-1{ width:100%; height:50px; background:linear-gradient(180deg,#111 0%,#000 100%); border:1px solid #FF2E93; border-top:none; }
        .cake-layer-2{ width:78%; height:44px; background:linear-gradient(180deg,#111 0%,#000 100%); border:1px solid #FF2E93; border-bottom:none; margin-bottom:-1px; }
        .cake-layer-3{ width:58%; height:38px; background:linear-gradient(180deg,#111 0%,#000 100%); border:1px solid #FF2E93; border-bottom:none; margin-bottom:-1px; }
        .frosting{ position:absolute; top:-6px; left:0; right:0; height:12px; background:#FF2E93; border-radius:6px; box-shadow:0 0 12px rgba(255,46,147,.55); }
        .candles{ position:absolute; top:-42px; left:0; right:0; display:flex; justify-content:center; gap:10px; }
        .candle{ width:4px; height:25px; background:#FFF; border-radius:2px; position:relative; }
        .flame{ position:absolute; top:-14px; left:50%; transform:translateX(-50%); width:8px; height:14px; background:radial-gradient(ellipse at bottom,#FFF 0%,#FF2E93 60%,transparent 100%); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; animation:svcFlicker .6s ease-in-out infinite alternate; }
        @keyframes svcFlicker{ 0%{ transform:translateX(-50%) scale(1) rotate(-3deg); } 100%{ transform:translateX(-50%) scale(1.1) rotate(3deg); } }

        /* ── Champagne ── */
        .champ-wrapper{ position:relative; width:78px; height:188px; z-index:1; }
        @media(min-width:1024px){ .champ-wrapper{ width:112px; height:282px; } }
        .champ-glass{ position:relative; width:100%; height:100%; }
        .champ-bowl{ position:absolute; top:0; left:50%; transform:translateX(-50%); width:100%; height:45%; background:linear-gradient(180deg,rgba(255,255,255,.05) 0%,rgba(212,175,55,.1) 100%); border:2px solid rgba(255,255,255,.2); border-radius:0 0 50px 50px; overflow:hidden; }
        .champ-liquid{ position:absolute; bottom:0; left:0; right:0; height:65%; background:linear-gradient(180deg,rgba(212,175,55,.55) 0%,rgba(212,175,55,.8) 100%); border-radius:0 0 50px 50px; border-top:2px solid rgba(255,255,255,.35); }
        .champ-bubbles{ position:absolute; inset:0; overflow:hidden; }
        .champ-bubble{ position:absolute; bottom:0; width:3px; height:3px; background:rgba(255,255,255,.85); border-radius:50%; animation:svcRise 2.2s ease-in-out infinite; }
        @keyframes svcRise{ 0%{ bottom:0; opacity:0; transform:scale(.5); } 20%{ opacity:1; } 100%{ bottom:100%; opacity:0; transform:scale(1.5); } }
        .champ-stem{ position:absolute; top:45%; left:50%; transform:translateX(-50%); width:4px; height:50%; background:rgba(255,255,255,.18); border-left:1px solid rgba(255,255,255,.28); border-right:1px solid rgba(255,255,255,.08); }
        .champ-base{ position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:60px; height:6px; background:rgba(255,255,255,.18); border-radius:50%; border:1px solid rgba(255,255,255,.28); }

        /* ── Features ── */
        .svc-feat li{ display:flex; align-items:flex-start; gap:.7rem; margin-bottom:.6rem; font-size:.75rem; color:#86868B; }
        @media(min-width:1024px){ .svc-feat li{ font-size:.875rem; margin-bottom:.9rem; align-items:center; } }
        .svc-feat i{ font-size:.95rem; margin-top:2px; flex-shrink:0; }
        @media(min-width:1024px){ .svc-feat i{ font-size:1.1rem; margin-top:0; } }

        /* ── Button ── */
        .svc-btn{
          position:relative; overflow:hidden; display:inline-flex; align-items:center; justify-content:center;
          background:#FFFFFF; color:#0A0A0A; transition:color .3s ease; cursor:pointer; border:none;
        }
        .svc-btn::before{ content:''; position:absolute; top:100%; left:0; width:100%; height:100%; background:#FF2E93; transition:top .4s ease; z-index:1; }
        .svc-btn:hover{ color:#FFFFFF; }
        .svc-btn:hover::before{ top:0; }
        .svc-btn span{ position:relative; z-index:2; }
      `}</style>

      {/* <section ref={ref} className="bg-brand-black text-white border-t border-brand-border w-full overflow-x-hidden"> */}
      <section ref={ref} className="bg-brand-black text-white border-t border-brand-border w-full">

        {/* ── Section heading ── */}
        {/* <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-12 pt-12 sm:pt-16 md:pt-24 pb-0"> */}
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-12 pt-12 sm:pt-16 md:pt-24 pb-0 flex flex-col justify-center min-h-[30svh]">
          <h2 className="svc-reveal text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-display font-bold tracking-tighter uppercase">
            Our Services
          </h2>
        </div>

        {/* ── Service rows ── */}
        {SERVICES.map((svc) => {
          const { Art } = svc;
          return (
            <div key={svc.id} data-snap-section className="border-brand-border mt-10 sm:mt-14 md:mt-20 first:mt-8">
              <div className="max-w-[1600px] mx-auto pt-8 px-3 sm:px-4 md:px-6 lg:px-12 py-14 md:py-24 lg:py-32">
                <div className={`flex flex-col ${svc.flip ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-10 lg:gap-20`}>

                  {/* Art */}
                  <div className="w-full lg:w-1/2 svc-reveal svc-scale">
                    <Art />
                  </div>

                  {/* Text */}
                  <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <span className={`svc-reveal text-[10px] md:text-xs font-bold tracking-[0.22em] uppercase ${svc.accentClass} mb-3 md:mb-5`}>
                      {svc.label}
                    </span>
                    <h3 className="svc-reveal svc-d1 text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tighter uppercase leading-[0.9] text-white mb-4 md:mb-6">
                      {svc.heading[0]}<br />{svc.heading[1]}
                    </h3>
                    <p className="svc-reveal svc-d2 text-xs md:text-sm lg:text-base text-brand-gray leading-relaxed mb-6 md:mb-8 max-w-md">
                      {svc.body}
                    </p>
                    <ul className="svc-reveal svc-d2 svc-feat mb-8 md:mb-10 text-left w-fit">
                      {svc.features.map((f) => (
                        <li key={f.text}>
                          <i className={`${f.icon} ${f.gold ? "text-brand-gold" : "text-brand-accent"}`} />
                          {f.text}
                        </li>
                      ))}
                    </ul>
                    <button className="svc-reveal svc-d3 svc-btn px-8 md:px-10 py-3 md:py-4 rounded-full text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase w-full md:w-auto">
                      <span>{svc.cta}</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          );
        })}

      </section>
    </>
  );
}