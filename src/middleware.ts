import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Permanently redirects the old ?category= filter links to the crawlable
// /udlejning/kategori/[slug] route, preserving any other query params (q, page).
export function middleware(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category')
  if (!category) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/udlejning/kategori/${category}`
  url.searchParams.delete('category')

  return NextResponse.redirect(url, 308)
}

export const config = {
  matcher: '/udlejning',
}
