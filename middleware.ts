import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase()
  const pathname = request.nextUrl.pathname

  const isMateteesApp = host.includes('matetees.app')
  const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/')

  // Only block the dashboard page on matetees.app
  if (isMateteesApp && isDashboard) {
    return new NextResponse('Not Found', { status: 404 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
}
