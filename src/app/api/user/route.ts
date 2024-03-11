import {NextRequest, NextResponse} from "next/server";
import {Database} from "../../../../database.types";
import {createClient} from "@/utils/supabase/server";

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  if (request.nextUrl.searchParams.get("notAdmin") === "true"){
    let resp = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Guests?id=eq.${id}&select=id,locked,alias,role,auth_id`, {
      headers: {
        "apikey": process.env.SERVICE_KEY!,
        "Authorization": `Bearer ${process.env.SERVICE_KEY!}`,
      }
    })
    let ticketData = await resp.json()

    let response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Admins?select=*`, {
      headers: {
        "apikey": process.env.SERVICE_KEY!,
        "Authorization": `Bearer ${process.env.SERVICE_KEY!}`,
      }
    })
    let adminData = await response.json()

     for (const admin of adminData){
      if (admin.id === ticketData[0].auth_id) {
        return NextResponse.json([{
          id: ticketData[0].id,
          locked: ticketData[0].locked,
          alias: ticketData[0].alias,
          role: ticketData[0].role
        }], {status: 200})
      }
    }

    return NextResponse.json({ error: "No access"}, {status: 400})
  }


  const supabase = createClient()


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

export async function POST(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createClient<Database>()

  const {data: admin} = await supabase.from("Admins").select("*")
  if (!admin || admin.length < 1) {
    return NextResponse.json({error: "No Access"}, {status: 403})
  }

  const body = await request.json()

  body["auth_id"] = admin[0].id

  console.log(body)

  let resp = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Guests?select=*`, {
    method: "POST",
    headers: {
      "apikey": process.env.SERVICE_KEY!,
      "Authorization": `Bearer ${process.env.SERVICE_KEY!}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify(body)
  })

  let data = await resp.json()

  console.log(data)
  return NextResponse.json([{id: data[0].id}], {status: 200})
}