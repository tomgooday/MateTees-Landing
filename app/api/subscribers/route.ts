import { NextRequest, NextResponse } from 'next/server'
import { getSubscribers, getSubscriberCount } from '@/lib/db'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const countOnly = url.searchParams.get('count') === 'true'

  if (countOnly) {
    try {
      const count = await getSubscriberCount()
      const numericCount = typeof count === 'string' ? parseInt(count, 10) : Number(count) || 0
      return NextResponse.json({ count: numericCount })
    } catch (error) {
      console.error('Error fetching subscriber count:', error)
      // Graceful fallback instead of 500 so UI keeps working
      return NextResponse.json({ count: 0, fallback: true })
    }
  }

  try {
    const subscribers = await getSubscribers()
    return NextResponse.json({ subscribers: Array.isArray(subscribers) ? subscribers : [] })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    // Graceful fallback instead of 500 so UI keeps working
    return NextResponse.json({ subscribers: [], fallback: true })
  }
}
