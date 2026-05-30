import Image from 'next/image';
import { notFound } from 'next/navigation';
import { query } from '@/lib/database/db';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import CityEvents from '@/components/City/CityEvents';

// Define the expected database row shape
interface CityPageData {
  id: string;
  slug: string;
  title: string;
  footer_label: string;
  greeting: string | null;
  content: any | null;
  image_url: string | null;
  secondary_content: any | null;
}

interface PageProps {
  params: {
    slug: string;
  };
}

type MetadataProps = {
  params: Promise<{ slug: string }>;
};

export default async function CityPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Fetch the data directly from Postgres
  const result = await query(
    `SELECT * FROM city_pages WHERE slug = $1 LIMIT 1`, 
    [slug]
  );
  
  const city: CityPageData | undefined = result.rows[0];

  // 2. If the slug doesn't exist, trigger Next.js 404
  if (!city) {
    notFound();
  }

  // 3. Convert Tiptap JSON to raw HTML
  let htmlContent = '';
  let htmlSecondary = '';

  if (city.content) {
    try {
      htmlContent = generateHTML(city.content, [StarterKit]);
    } catch (error) {
      console.error('Failed to parse Tiptap JSON:', error);
    }
  }

  if (city.secondary_content) {
    try {
      htmlSecondary = generateHTML(city.secondary_content, [StarterKit]);
    } catch (error) {
      console.error('Failed to parse Tiptap JSON for secondary content:', error);
    }
  }

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Scoped CSS for the "fill in from center" animation.
        This keeps your tailwind config clean while delivering the exact effect.
      */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideOutLeft {
            0% { opacity: 0; transform: translateX(10vw) scale(0.95); }
            100% { opacity: 1; transform: translateX(0) scale(1); }
          }
          @keyframes slideOutRight {
            0% { opacity: 0; transform: translateX(-10vw) scale(0.95); }
            100% { opacity: 1; transform: translateX(0) scale(1); }
          }
          .animate-from-center-left {
            animation: slideOutLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-from-center-right {
            animation: slideOutRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          .prose p:empty::after {
            content: '\\00A0'; /* Non-breaking space */
          }
        `
      }} />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        
        {/* ─── HERO SECTION (Split Layout) ─── */}
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          
          {/* Left Side: Text */}
          <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left md:animate-from-center-left order-1">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
            {city.title}
            </h1>
            
            {city.greeting && (
            <p className="text-lg md:text-2xl text-gray-600 font-light leading-relaxed mb-6">
                {city.greeting}
            </p>
            )}

            {/* NEW: Secondary Content goes here */}
            {htmlSecondary && (
            <div 
                className="prose prose-md text-gray-700 max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlSecondary }}
            />
            )}
        </div>

          {/* Right Side / Mobile Bottom: Image */}
          <div className="w-full md:w-1/2 order-2 md:animate-from-center-right">
            {city.image_url ? (
              <div className="relative w-full aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={city.image_url}
                  alt={city.title}
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
                />
              </div>
            ) : (
              <div className="w-full aspect-[4/3] md:aspect-square bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          
        </div>

        {/* ─── MAIN CONTENT (Tiptap HTML) ─── */}
        <div className="mt-16 md:mt-24 pt-12 border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            {htmlContent ? (
              <article 
                className="prose prose-lg md:prose-xl prose-blue max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            ) : (
              <p className="text-gray-500 italic text-center">No content available for this city yet.</p>
            )}
          </div>
        </div>

        {/* ─── NEW: DYNAMIC CITY EVENTS ─── */}
        <CityEvents cityName={city.footer_label} />

      </div>
    </main>
  );
}

// Optional: Generate metadata dynamically for SEO
export async function generateMetadata({ params }: MetadataProps) {
  // Await the params promise before destructuring
  const { slug } = await params;

  const result = await query(
    `SELECT title, greeting FROM city_pages WHERE slug = $1 LIMIT 1`, 
    [slug]
  );
  const city = result.rows[0];

  if (!city) return { title: 'City Not Found' };

  return {
    title: `${city.title} | Bollywood Club`,
    description: city.greeting || `Learn more about ${city.title}`,
  };
}