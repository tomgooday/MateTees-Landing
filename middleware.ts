import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase()
  const pathname = request.nextUrl.pathname

  const isMateesApp = host.includes('matees.app')
  const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/')

  // Only block the dashboard page on matees.app
  if (isMateesApp && isDashboard) {
    return new NextResponse('Not Found', { status: 404 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
}
