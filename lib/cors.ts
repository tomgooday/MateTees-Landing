export const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN || 'https://www.matetees.com.au'

export function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': ADMIN_ORIGIN,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}
