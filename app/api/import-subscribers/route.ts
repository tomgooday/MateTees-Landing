import { NextRequest, NextResponse } from 'next/server'
import { addSubscriber } from '@/lib/db'
import { corsHeaders } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { headers: corsHeaders(request) })
}

export async function POST(request: NextRequest) {
  try {
    const { subscribers } = await request.json()
    
    if (!Array.isArray(subscribers)) {
      return NextResponse.json({ error: 'Subscribers must be an array' }, { status: 400, headers: corsHeaders(request) })
    }

    const results = []
    for (const subscriber of subscribers) {
      try {
        await addSubscriber(subscriber.email, subscriber.optIn || true)
        results.push({ email: subscriber.email, success: true })
      } catch (error) {
        results.push({ email: subscriber.email, success: false, error: error.message })
      }
    }

    return NextResponse.json({ 
      success: true, 
      imported: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results 
    }, { headers: corsHeaders(request) })
  } catch (error) {
    console.error('Error importing subscribers:', error)
    return NextResponse.json({ error: 'Failed to import subscribers' }, { status: 500, headers: corsHeaders(request) })
  }
}
