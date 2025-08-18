import { NextRequest, NextResponse } from 'next/server'
import { createTables } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    await createTables()
    return NextResponse.json({ success: true, message: 'Database tables created successfully' })
  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json({ error: 'Failed to setup database' }, { status: 500 })
  }
}
