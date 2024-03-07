import {NextRequest, NextResponse} from "next/server";
import {type CookieOptions, createServerClient} from "@supabase/ssr";
import {Database} from "../../../../database.types";

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })


  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SERVICE_KEY!,
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

  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  const {data: admin} = await supabase.from("Admins").select("*")
  if (!admin || admin.length < 1) {
    return NextResponse.json({error: "No Access"}, {status: 403})
  }

  console.log(id)

  if (!id) {
    return NextResponse.json({error: "No ID provided"}, {status: 400})

  }

  let resp = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Guests?id=eq.${id}&select=scanned`, {
    headers: {
      "apikey": process.env.SERVICE_KEY!,
      "Authorization": `Bearer ${process.env.SERVICE_KEY!}`,
    }
  })
  let data = await resp.json()

  if (data == null) {
    return NextResponse.json(true, {status: 200})
  } else if (data[0].scanned == false) {
    let resp = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Guests?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        "apikey": process.env.SERVICE_KEY!,
        "Authorization": `Bearer ${process.env.SERVICE_KEY!}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({scanned: true})
    })
    return NextResponse.json(false, {status: 200})
  } else {
    return NextResponse.json(true, {status: 200})
  }
}