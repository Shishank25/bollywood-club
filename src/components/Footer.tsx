import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-white pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto fade-up">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24 text-sm font-medium">

          {/* Brand & Contact */}
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              className="text-2xl font-display font-bold tracking-tighter uppercase text-brand-black flex items-center gap-1"
            >
              BOLLYWOODCLUB<span className="w-1.5 h-1.5 bg-brand-accent rounded-full mb-3" />
            </Link>
            <div className="flex flex-col gap-2 text-brand-gray">
              <a href="tel:+61483952024" className="hover:text-brand-black transition-colors">
                +61 483952024
              </a>
              <a href="tel:+6531381490" className="hover:text-brand-black transition-colors">
                +65 31381490
              </a>
              <a
                href="mailto:info@bollywoodclubx.com"
                className="hover:text-brand-black transition-colors mt-2 text-brand-black font-semibold underline underline-offset-4"
              >
                info@bollywoodclubx.com
              </a>
            </div>
          </div>

          {/* Territories */}
          <div className="flex flex-col gap-6">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-black">Territories</p>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-brand-gray">
              {[
                "Melbourne", "Singapore",
                "Sydney", "Adelaide",
                "Brisbane", "Perth",
                "Auckland",
              ].map((city) => (
                <Link key={city} href="#" className="hover:text-brand-black transition-colors">
                  {city}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-6">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-black">Legal</p>
            <div className="flex flex-col gap-3 text-brand-gray">
              <Link href="/privacy" className="hover:text-brand-black transition-colors">Privacy Policy</Link>
              <Link href="/dress-code" className="hover:text-brand-black transition-colors">Dress Code</Link>
              <Link href="/terms" className="hover:text-brand-black transition-colors">Terms &amp; Conditions</Link>
            </div>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-6">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-black">Socials</p>
            <div className="flex gap-4 text-xl text-brand-black">
              <a href="#" aria-label="Instagram" className="hover:text-brand-accent transition-colors">
                <i className="fa-brands fa-instagram" />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-brand-accent transition-colors">
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-brand-accent transition-colors">
                <i className="fa-brands fa-youtube" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-brand-accent transition-colors">
                <i className="fa-brands fa-twitter" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-brand-border gap-4">
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-brand-gray">
            © 2024 Bollywood Club. Owned by Louder World Pty Ltd.
          </p>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-black">
            Designed for Nightlife
          </p>
        </div>

      </div>
    </footer>
  );
}