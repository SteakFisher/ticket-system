"use client"

import { Scanner} from '@yudiel/react-qr-scanner';
import {useEffect, useState} from "react";
import {createClient} from "@/utils/supabase/client";
import {Database} from "../../database.types";

export default function QRComponent() {
  const [id, setId] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const supabase = createClient<Database>()

  useEffect(() => {
    let fetchData = async () => {
      if(id){
        setIsLoading(true)
        console.log("Fetch")
        // const {data} = await supabase.from("Guests").select("scanned").eq("id", id)
        const response = await fetch(`/api/user?id=${id}`)
        const data = await response.json()

        if (data == null) {
          setIsSuccess(false)
        } else if (data[0].scanned == false) {
          await supabase.from("Guests").update({scanned: true}).eq("id", id)
          setIsSuccess(true)
        } else {
          setIsSuccess(false)
        }

        setIsLoading(false)
      }
    }

    fetchData()
  }, [supabase, id])

  return (
    <>
      {
        !id ? (
          <Scanner
            onResult={(result) => {
              if(result){
                if (result !== id) {
                  setId(result)
                }
              }
            }}
          />

        ) : isLoading ? (
          <h1>Loading...</h1>
        ) : isSuccess ? (
          <h1>Success</h1>
        ) : (
          <h1>Already Scanned</h1>
        )
      }
      {
        id ? (
          <button onClick={() => {
            setId("")
            setIsLoading(false)
            setIsSuccess(false)
          }}>Scan Again</button>
        ) : null
      }
    </>
  )
}