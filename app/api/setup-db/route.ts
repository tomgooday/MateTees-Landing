import { NextRequest, NextResponse } from 'next/server'
import { createTables } from '@/lib/db'
import { corsHeaders } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { headers: corsHeaders(request) })
}

export async function POST(request: NextRequest) {
  try {
    await createTables()
    return NextResponse.json({ success: true, message: 'Database tables created successfully' }, { headers: corsHeaders(request) })
  } catch (error) {
    console.error('Error setting up database:', error)
    return NextResponse.json({ error: 'Failed to setup database' }, { status: 500, headers: corsHeaders(request) })
  }
}
