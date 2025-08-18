import { NextRequest, NextResponse } from 'next/server'
import { createTables } from '@/lib/db'
import { corsHeaders } from '@/lib/cors'

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders() })
}

export async function POST(request: NextRequest) {
  try {
    await createTables()
    return NextResponse.json({ success: true, message: 'Database tables created successfully' }, { headers: corsHeaders() })
  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json({ error: 'Failed to setup database' }, { status: 500, headers: corsHeaders() })
  }
}
