import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BLOCKED_PATHS = [
  '/dashboard',
  '/api/subscribers',
  '/api/import-subscribers',
  '/api/setup-db',
]

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase()
  const pathname = request.nextUrl.pathname

  const isMateteesApp = host.includes('matetees.app')
  const isBlockedPath = BLOCKED_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))

  if (isMateteesApp && isBlockedPath) {
    // Hide dashboard and sensitive APIs on matetees.app
    return new NextResponse('Not Found', { status: 404 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/subscribers/:path*',
    '/api/import-subscribers/:path*',
    '/api/setup-db/:path*',
  ],
}
