import { NextRequest, NextResponse } from 'next/server'
import { getSubscribers, getSubscriberCount } from '@/lib/db'
import { corsHeaders } from '@/lib/cors'

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders() })
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const countOnly = url.searchParams.get('count') === 'true'

  if (countOnly) {
    try {
      const count = await getSubscriberCount()
      const numericCount = typeof count === 'string' ? parseInt(count, 10) : Number(count) || 0
      return NextResponse.json({ count: numericCount }, { headers: corsHeaders() })
    } catch (error) {
      console.error('Error fetching subscriber count:', error)
      return NextResponse.json({ count: 0, fallback: true }, { headers: corsHeaders() })
    }
  }

  try {
    const subscribers = await getSubscribers()
    return NextResponse.json({ subscribers: Array.isArray(subscribers) ? subscribers : [] }, { headers: corsHeaders() })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json({ subscribers: [], fallback: true }, { headers: corsHeaders() })
  }
}
