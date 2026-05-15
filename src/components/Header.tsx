"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header
        id="navbar"
        ref={navbarRef}
        className={`fixed top-0 left-0 w-full z-50 py-6 px-6 md:px-12 flex justify-between items-center bg-white/80 backdrop-blur-md${
          isScrolled ? " scrolled" : ""
        }`}
      >
        <Link
          href="/"
          className="text-2xl md:text-3xl font-display font-bold tracking-widest uppercase text-brand-black flex items-center gap-1 relative z-[60]"
        >
          BOLLYWOOD<span className="text-brand-accent">CLUB</span>
        </Link>
        

        <nav className="lg:flex space-x-12 items-center text-xs font-semibold tracking-[0.15em] uppercase text-brand-black">
          <Link href="/events" className="hover:text-brand-accent transition-colors">
            Events
          </Link>
          <Link href="/gallery" className="hover:text-brand-accent transition-colors">
            Gallery
          </Link>
          <Link href="/blogs" className="hover:text-brand-accent transition-colors">
            Blogs
          </Link>
        </nav>

        <div className="flex items-center gap-6 relative z-[60]">
          <button
            id="menu-btn"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`w-10 h-10 flex flex-col justify-center items-end gap-1.5 group cursor-pointer${
              isMenuOpen ? " menu-open" : ""
            }`}
            aria-label="Toggle Menu"
          >
            <span className="ham-line ham-top w-8 h-[2px] bg-brand-black group-hover:w-full" />
            <span className="ham-line ham-mid w-full h-[2px] bg-brand-black" />
            <span className="ham-line ham-bot w-6 h-[2px] bg-brand-black group-hover:w-full" />
          </button>
        </div>
      </header>

      {/* Menu Overlay */}
      <div
        id="menu-overlay"
        className={`fixed inset-0 bg-brand-white z-50 flex flex-col justify-center px-6 md:px-24 pt-20 pb-10 overflow-y-auto${
          isMenuOpen ? " open" : ""
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-[1600px] mx-auto h-full items-center">
          <div 
            className="absolute right-10 top-6 p-1 rounded-full font-bold text-black text-5xl cursor-pointer
             hover:scale
            "
            onClick={closeMenu}>
            X
          </div>
          <nav className="flex flex-col space-y-4 md:space-y-6">
            {[
              { label: "Home", href: "/" },
              { label: "Events", href: "#events" },
              { label: "Gallery", href: "/gallery" },
              { label: "Blogs", href: "/blogs" },
            ].map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="menu-item text-4xl md:text-6xl lg:text-7xl font-display font-extrabold uppercase tracking-tighter text-brand-black hover:text-outline transition-all duration-300 w-fit"
                style={{ transitionDelay: `${0.1 + i * 0.05}s` }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-col space-y-4 md:space-y-6 border-t md:border-t-0 md:border-l border-brand-border pt-8 md:pt-0 md:pl-12">
            {[
              { label: "Birthday", href: "/birthday", delay: "0.3s" },
              { label: "VIP Reservations", href: "/vip", delay: "0.35s" },
              { label: "Corporate Galas", href: "/corporate", delay: "0.4s" },
              { label: "Careers", href: "/careers", delay: "0.45s" },
              { label: "Contact Us", href: "/contact", delay: "0.5s" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="menu-item text-2xl md:text-4xl font-display font-bold uppercase tracking-tighter text-brand-gray hover:text-brand-black transition-colors w-fit"
                style={{ transitionDelay: item.delay }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}