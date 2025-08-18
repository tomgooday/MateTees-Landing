import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BLOCKED_PATHS = [
  '/dashboard',
  '/api/setup-db',
]

const API_PATHS = [
  '/api/subscribers',
  '/api/import-subscribers',
]

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase()
  const pathname = request.nextUrl.pathname
  const origin = request.headers.get('origin') || ''

  const isMateteesApp = host.includes('matetees.app')
  const isAdminOrigin = origin.includes('matetees.com.au')
  const isBlockedPath = BLOCKED_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
  const isApiPath = API_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))

  // Block dashboard and setup-db on matetees.app
  if (isMateteesApp && isBlockedPath) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // Allow API access from admin domain, block direct browser access on matetees.app
  if (isMateteesApp && isApiPath && !isAdminOrigin) {
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
