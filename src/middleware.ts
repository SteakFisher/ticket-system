import { updateSession } from '@/utils/supabase/middleware'
import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";

export async function middleware(request: NextRequest) {
  console.log("hey")
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createClient();

  const { data: { user }} = await supabase.auth.getUser()
  console.log(user)

  if (request.nextUrl.pathname === '/' && user) {
    return NextResponse.redirect(new URL("/form", request.url))
  } else if(request.nextUrl.pathname !== '/' && !user) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}