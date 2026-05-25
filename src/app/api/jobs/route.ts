import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Helper to simulate future middleware auth
// Middleware will eventually set this header if the user is a verified admin
const checkIsAdmin = (req: NextRequest) => req.headers.get('x-admin-role') === 'true';

// ─── GET: Fetch Jobs with Pagination ─────────────────────────────────────────

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  
  // Pagination params
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
  const offset = (page - 1) * limit;

  // Check auth
  const isAdmin = checkIsAdmin(req);

  try {
    let jobs, totalCountRes;

    // Users only see 'active' jobs. Admins see everything.
    if (isAdmin) {
      jobs = await sql`
        SELECT * FROM jobs 
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `;
      totalCountRes = await sql`SELECT COUNT(*) FROM jobs`;
    } else {
      jobs = await sql`
        SELECT * FROM jobs 
        WHERE status = 'active' 
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `;
      totalCountRes = await sql`SELECT COUNT(*) FROM jobs WHERE status = 'active'`;
    }

    const totalCount = parseInt(totalCountRes[0].count, 10);

    return NextResponse.json({
      data: jobs,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      }
    });
  } catch (err) {
    console.error('[GET /api/jobs]', err);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// ─── POST: Create a New Job ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!checkIsAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    
    // Wrap the TipTap HTML string in a JSON object
    const jsonContent = JSON.stringify({ html: body.content });

    const result = await sql`
      INSERT INTO jobs (
        slug, designation, department, experience_min, experience_max, 
        experience_label, employment_type, location, content, status, 
        open_date, closing_date
      ) VALUES (
        ${body.slug}, ${body.designation}, ${body.department}, 
        ${body.experience_min || 0}, ${body.experience_max || 0}, 
        ${body.experience_label}, ${body.employment_type || 'full_time'}, 
        ${body.location}, 
        ${jsonContent}::jsonb, 
        ${body.status || 'draft'}, 
        ${body.open_date || null}, ${body.closing_date || null}
      )
      RETURNING *;
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/jobs]', err);
    if (err.code === '23505') return NextResponse.json({ error: 'Job slug must be unique' }, { status: 409 });
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

// ─── PATCH: Update an Existing Job ───────────────────────────────────────────

export async function PATCH(req: NextRequest) {
  if (!checkIsAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { job_id, ...updates } = body;

    if (!job_id) return NextResponse.json({ error: 'job_id is required' }, { status: 400 });

    // Pre-format the content if it's being updated
    const jsonContent = updates.content ? JSON.stringify({ html: updates.content }) : null;

    const result = await sql`
      UPDATE jobs SET
        slug = COALESCE(${updates.slug}, slug),
        designation = COALESCE(${updates.designation}, designation),
        department = COALESCE(${updates.department}, department),
        experience_min = COALESCE(${updates.experience_min}, experience_min),
        experience_max = COALESCE(${updates.experience_max}, experience_max),
        experience_label = COALESCE(${updates.experience_label}, experience_label),
        employment_type = COALESCE(${updates.employment_type}, employment_type),
        location = COALESCE(${updates.location}, location),
        content = COALESCE(${jsonContent}::jsonb, content),
        status = COALESCE(${updates.status}, status),
        open_date = COALESCE(${updates.open_date}, open_date),
        closing_date = COALESCE(${updates.closing_date}, closing_date),
        updated_at = CURRENT_TIMESTAMP
      WHERE job_id = ${job_id}
      RETURNING *;
    `;

    if (result.length === 0) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

    return NextResponse.json(result[0]);
  } catch (err: any) {
    console.error('[PATCH /api/jobs]', err);
    if (err.code === '23505') return NextResponse.json({ error: 'Job slug must be unique' }, { status: 409 });
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}