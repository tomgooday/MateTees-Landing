import { NextRequest, NextResponse } from 'next/server'
import { getSubscribers, getSubscriberCount } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const countOnly = searchParams.get('count') === 'true'
    
    if (countOnly) {
      const count = await getSubscriberCount()
      return NextResponse.json({ count: parseInt(count) })
    }

    const subscribers = await getSubscribers()
    return NextResponse.json({ subscribers })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
