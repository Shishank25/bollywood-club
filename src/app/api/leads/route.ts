import { query } from '@/lib/database/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Extract the new 'company_name' field
    const { 
      form_type, f_name, l_name, email, phone, city, 
      total_guests, description, company_name 
    } = body;

    // 2. Validate required fields
    if (!form_type || !f_name || !email || !city) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 3. Extract IP and Source URL 
    const ip_address = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown IP';
    const source_url = request.headers.get('referer') || 'Direct';

    const region = null;
    const country = null;

    // 4. Insert into the database (Now includes company_name at the end)
    const sql = `
      INSERT INTO lead_submissions 
      (form_type, f_name, l_name, email, phone, city, region, country, ip_address, source_url, total_guests, description, company_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id;
    `;
    
    const values = [
      form_type, 
      f_name, 
      l_name || null, 
      email || null, 
      phone || null, 
      city, 
      region, 
      country, 
      ip_address, 
      source_url,
      total_guests ? parseInt(total_guests) : null,
      description || null,
      company_name || null // <--- Dedicated company name injection
    ];

    await query(sql, values);

    return NextResponse.json({ success: true, message: 'Lead captured' }, { status: 200 });

  } catch (error: any) {
    console.error("Lead Submission Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}