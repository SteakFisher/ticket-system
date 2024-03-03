"use client"
import {QrReader} from "react-qr-reader";
import {createClient} from "@/utils/supabase/client";
import {Suspense, useState} from "react";
import Loading from "@/components/Loading";
import {Database} from "../../database.types";
import {Button} from "@/components/ui/button";

export async function Card({id}: {id: string}) {
  const supabase = createClient<Database>()
  const {data, error} = await supabase.from("Guests").select("scanned").eq("id", id).single()

  if (data == null || error) {
    return (
      <>
        <h1>Invalid QR code</h1>
      </>
    )
  } else if (data["scanned"] == false) {
    await supabase.from("Guests").update({scanned: true}).eq("id", id)
    return (<h1>Success</h1>)
  } else if (data["scanned"] == true) {
    return (
      <>
        <h1>Already scanned</h1>
      </>
    )

  }
}

export default function ScannerComponent() {
  const [data, setData] = useState<string>("")

  return (
    !data ? (
      <div>
        <h1>Scanner</h1>
        <p>Scan the QR code to check in.</p>
        <QrReader constraints={{facingMode: "user"}} onResult={(result, error) => {
          console.log(result?.toString())
          if (error) {
            console.error(error)
            return
          }
          if (result?.toString()) {
            setData(result?.toString())
          }
          return
        }}/>
      </div>
    ) : (
      <>
        <Suspense fallback={<Loading />}>
          <Card id={data} />
        </Suspense>
        <Button onClick={() => setData("")}>Scan Again</Button>
      </>

  ))
}