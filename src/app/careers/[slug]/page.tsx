// src/app/careers/[slug]/page.tsx
import { neon } from '@neondatabase/serverless';
import { notFound } from 'next/navigation';
import JobClientView from './JobClientView';

const sql = neon(process.env.DATABASE_URL!);

// Revalidate this page every 60 seconds so new jobs appear quickly
export const revalidate = 60; 

// Update the interface to reflect that params is now a Promise
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function JobDetailsPage({ params }: PageProps) {
  // 1. Await the params Promise to unwrap its properties
  const { slug } = await params;

  // 2. Use the unwrapped slug in your query
  const result = await sql`
    SELECT * FROM jobs 
    WHERE slug = ${slug} AND status = 'active' 
    LIMIT 1
  `;
  
  if (result.length === 0) {
    notFound();
  }

  const job = result[0];

  return <JobClientView job={job} />;
}