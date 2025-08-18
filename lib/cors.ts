import { NextResponse } from 'next/server'

export const corsHeaders = (request: Request) => {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }

  // Allow specific origin for admin access
  const adminOrigin = process.env.ADMIN_ORIGIN || 'https://www.matetees.com.au'
  const requestOrigin = request.headers.get('origin')

  if (requestOrigin === adminOrigin) {
    headers['Access-Control-Allow-Origin'] = requestOrigin
  } else {
    // For other origins, deny or set a default if needed, or just omit
    // For now, we'll just not set Access-Control-Allow-Origin for unapproved origins
  }
  return headers
}
