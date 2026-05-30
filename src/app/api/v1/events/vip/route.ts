import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database/db'; 

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      eventId, 
      eventName, 
      eventDate, 
      eventLocation, 
      fullName, 
      email, 
      phone, 
      guests 
    } = body;

    // Basic validation
    if (!eventId || !eventName || !fullName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Default guests to 1 if not provided or invalid
    const guestCount = parseInt(guests) || 1;

    const sql = `
      INSERT INTO vip_reservations (
        event_id, event_name, event_date, event_location, 
        full_name, email, phone, guests
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING id, status, created_at;
    `;

    const values = [
      eventId, 
      eventName, 
      eventDate || null, 
      eventLocation || null, 
      fullName, 
      email, 
      phone, 
      guestCount
    ];

    const result = await query(sql, values);

    return NextResponse.json({ 
      success: true, 
      reservation: result.rows[0] 
    }, { status: 201 });

  } catch (error) {
    console.error('[POST /api/v1/vip]', error);
    return NextResponse.json(
      { error: 'Failed to submit VIP reservation' }, 
      { status: 500 }
    );
  }
}