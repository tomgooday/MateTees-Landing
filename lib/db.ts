import { sql } from '@vercel/postgres'

export async function createTables() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        opt_in BOOLEAN NOT NULL DEFAULT true,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✅ Database tables created successfully')
  } catch (error) {
    console.error('❌ Error creating tables:', error)
    throw error
  }
}

export async function addSubscriber(email: string, optIn: boolean) {
  try {
    const result = await sql`
      INSERT INTO subscribers (email, opt_in)
      VALUES (${email}, ${optIn})
      ON CONFLICT (email) DO UPDATE SET
        opt_in = EXCLUDED.opt_in,
        timestamp = CURRENT_TIMESTAMP
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('❌ Error adding subscriber:', error)
    throw error
  }
}

export async function getSubscribers() {
  try {
    const result = await sql`
      SELECT * FROM subscribers 
      ORDER BY created_at DESC
    `
    return result.rows
  } catch (error) {
    console.error('❌ Error getting subscribers:', error)
    throw error
  }
}

export async function getSubscriberCount() {
  try {
    const result = await sql`
      SELECT COUNT(*) as count FROM subscribers
    `
    return result.rows[0].count
  } catch (error) {
    console.error('❌ Error getting subscriber count:', error)
    throw error
  }
}
