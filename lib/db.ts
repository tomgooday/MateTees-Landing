import { sql } from '@vercel/postgres'

// Fallback in-memory storage for when Postgres is not available
let localSubscribers: Array<{id: number, email: string, opt_in: boolean, timestamp: string, created_at: string}> = []
let localIdCounter = 1

// Check if Postgres is available (works for both development and production)
const isPostgresAvailable = process.env.POSTGRES_URL && process.env.POSTGRES_URL !== ''

export async function createTables() {
  try {
    if (!isPostgresAvailable) {
      console.log('✅ Using local storage (no database setup needed)')
      return
    }
    
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
    if (!isPostgresAvailable) {
      // Check if email already exists
      const existingIndex = localSubscribers.findIndex(s => s.email === email)
      const now = new Date().toISOString()
      
      if (existingIndex >= 0) {
        // Update existing subscriber
        localSubscribers[existingIndex] = {
          ...localSubscribers[existingIndex],
          opt_in: optIn,
          timestamp: now
        }
        return localSubscribers[existingIndex]
      } else {
        // Add new subscriber
        const newSubscriber = {
          id: localIdCounter++,
          email,
          opt_in: optIn,
          timestamp: now,
          created_at: now
        }
        localSubscribers.push(newSubscriber)
        return newSubscriber
      }
    }

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
    if (!isPostgresAvailable) {
      return localSubscribers.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }

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
    if (!isPostgresAvailable) {
      return localSubscribers.length.toString()
    }

    const result = await sql`
      SELECT COUNT(*) as count FROM subscribers
    `
    return result.rows[0].count
  } catch (error) {
    console.error('❌ Error getting subscriber count:', error)
    throw error
  }
}
