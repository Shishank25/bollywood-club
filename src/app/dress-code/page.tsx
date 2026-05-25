// src/app/dress-code/page.tsx
import { getLegalContent } from '@/lib/fetchLegalContent';
import { notFound } from 'next/navigation';

/**
 * TipTap uses empty <p></p> tags as spacer/line-break elements.
 * Tailwind's prose plugin collapses these to zero height.
 * Replace them with a non-breaking space so the paragraph
 * retains its natural line height and acts as a visual gap.
 */
function preserveEmptyParagraphs(html: string): string {
  return html.replace(/<p><\/p>/g, '<p>&nbsp;</p>');
}

// Optional: Force this page to be statically generated and revalidated
export const revalidate = 86400; // Revalidate every 24 hours

export default async function DressCodePage() {
  // Fetch the dress code data
  const doc = await getLegalContent('dress-code');

  console.log('Fetched Dress Code Document:', doc); // Debug log to verify data fetching

  if (!doc) {
    notFound(); 
  }

  return (
    // Increased max-width from 3xl to 6xl to accommodate the side-by-side layout
    <main className="flex max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 mt-8">

      {/* LEFT COLUMN: A4 Ratio Image */}
      {/* w-full on mobile, fixed to 1/3 or roughly 384px on desktop */}
      {doc.image_url && (
        <div className="w-full md:w-[350px] lg:w-[500px] flex-shrink-0">
        {/* aspect-[21/29.7] creates the perfect A4 ratio */}
            <div className="relative w-full aspect-[21/29.7] rounded-xl overflow-hidden shadow-xl bg-gray-100">
                {/* Using standard <img> for external URLs. If using Next/Image, update accordingly */}
                <img
                src={doc.image_url}
                alt={`${doc.label} visual reference`}
                className="absolute inset-0 w-full h-full object-contain"
                loading="lazy"
                />
            </div>
        </div>
      )}
      <div>
        <header className="mb-12 border-b pb-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            {doc.label}
            </h1>
        </header>

        {/* Layout Container: Stacks vertically on mobile, 
            switches to side-by-side flex on medium (md) screens and up.
        */}
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
            {/* RIGHT COLUMN: TipTap Content */}
            {/* flex-1 allows this column to take up the remaining space */}
            <article
            className="
                flex-1
                w-full
                prose
                prose-slate
                lg:prose-lg
                max-w-none
                text-gray-700
                prose-p:leading-7
                prose-p:my-5
                prose-li:my-1
                prose-h2:mt-8
                prose-h2:mb-4
                prose-h3:mt-6
                prose-h3:mb-3
                prose-hr:my-10
            "
            dangerouslySetInnerHTML={{ __html: preserveEmptyParagraphs(doc.content) }}
            />
            
        </div>
      </div>
    </main>
  );
}