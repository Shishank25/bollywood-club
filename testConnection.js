// test-db.ts (in your project root)
import { sql } from '@vercel/postgres';
import { config } from 'dotenv';
config({ path: '.env.local' });

async function testConnection() {
  try {
    const result = await sql`SELECT COUNT(*) FROM pages`;
    console.log('✅ Database connected!');
    console.log('Pages count:', result.rows[0]);
  } catch (error) {
    console.error('❌ Database error:', error);
  }
}

testConnection();