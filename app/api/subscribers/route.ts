import { NextRequest, NextResponse } from 'next/server'
import { getSubscribers, getSubscriberCount, deleteSubscriber } from '@/lib/db'
import { corsHeaders } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { headers: corsHeaders(request) })
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const countOnly = url.searchParams.get('count') === 'true'

  if (countOnly) {
    try {
      const count = await getSubscriberCount()
      const numericCount = typeof count === 'string' ? parseInt(count, 10) : Number(count) || 0
      return NextResponse.json({ count: numericCount }, { headers: corsHeaders(request) })
    } catch (error) {
      console.error('Error fetching subscriber count:', error)
      return NextResponse.json({ count: 0, fallback: true }, { headers: corsHeaders(request) })
    }
  }

  try {
    const subscribers = await getSubscribers()
    return NextResponse.json({ subscribers: Array.isArray(subscribers) ? subscribers : [] }, { headers: corsHeaders(request) })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json({ subscribers: [], fallback: true }, { headers: corsHeaders(request) })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400, headers: corsHeaders(request) })
    }

    const result = await deleteSubscriber(email)
    return NextResponse.json({ success: true, deleted: result }, { headers: corsHeaders(request) })
  } catch (error) {
    console.error('Error deleting subscriber:', error)
    return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500, headers: corsHeaders(request) })
  }
}
