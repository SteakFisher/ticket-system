import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  if (request.nextUrl.pathname.startsWith("/auth/callback")) return response

  if((request.nextUrl.pathname.startsWith("/form") && (request.nextUrl.searchParams.get("id"))) || (request.nextUrl.pathname.startsWith("/api/user") && (request.nextUrl.searchParams.get("notAdmin") === "true"))) {
    console.log("hit")
    return response
  }

  let {data: {user}} = await supabase.auth.getUser()
  if (user && request.nextUrl.pathname == "/") {
    response = NextResponse.redirect(new URL("/form", request.nextUrl.origin))
  } else if (!user && request.nextUrl.pathname != "/") {
    console.log(request.nextUrl)
    response = NextResponse.redirect(new URL("/", request.nextUrl.origin))
  }

  return response
}