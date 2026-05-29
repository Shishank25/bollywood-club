import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database/db'; 

export async function GET(
  request: NextRequest,
  // 1. Update the type to reflect that params is a Promise
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // 2. Await the params before destructuring the ID
    const { id } = await params; 

    if (!id) {
      return NextResponse.json({ error: 'Offer ID is required' }, { status: 400 });
    }

    const sql = `
      UPDATE offers 
      SET clicks = clicks + 1 
      WHERE id = $1 AND is_active = TRUE
      RETURNING 
        description, 
        how_to_redeem, 
        terms_and_conditions, 
        offer_code, 
        offer_type
    `;

    const result = await query(sql, [id]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Offer not found or inactive' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('[GET /api/offers/[id]]', error);
    return NextResponse.json(
      { error: 'Failed to fetch offer details' }, 
      { status: 500 }
    );
  }
}