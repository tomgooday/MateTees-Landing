import { NextRequest, NextResponse } from 'next/server'
import { addSubscriber } from '@/lib/db'
import { corsHeaders } from '@/lib/cors'

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders() })
}

export async function POST(request: NextRequest) {
  try {
    const { subscribers } = await request.json()

    if (!Array.isArray(subscribers)) {
      return NextResponse.json({ error: 'Invalid data format. Expected array of subscribers.' }, { status: 400, headers: corsHeaders() })
    }

    const results = {
      total: subscribers.length,
      imported: 0,
      skipped: 0,
      errors: [] as string[]
    }

    for (const subscriber of subscribers) {
      try {
        if (!subscriber.email || typeof subscriber.email !== 'string') {
          results.errors.push(`Invalid email for subscriber: ${JSON.stringify(subscriber)}`)
          results.skipped++
          continue
        }

        const email = subscriber.email.trim().toLowerCase()
        const optIn = subscriber.optIn !== undefined ? Boolean(subscriber.optIn) : true

        await addSubscriber(email, optIn)
        results.imported++
        
        console.log(`✅ Imported subscriber: ${email}`)
      } catch (error) {
        console.error(`❌ Error importing subscriber:`, subscriber, error)
        results.errors.push(`Failed to import ${subscriber.email}: ${error}`)
        results.skipped++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import completed. ${results.imported} imported, ${results.skipped} skipped.`,
      results
    }, { headers: corsHeaders() })

  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Failed to import subscribers' }, { status: 500, headers: corsHeaders() })
  }
}
