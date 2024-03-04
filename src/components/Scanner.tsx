"use client"

import { Scanner} from '@yudiel/react-qr-scanner';
import {useRouter} from "next/navigation";
import {useState} from "react";

let id = ""


export default function QRComponent() {
  const [enabled, setEnabled] = useState(true)
  const [data, setData] = useState<boolean | null>(null)


  return (
    <>
      <Scanner
        components={{
          audio: false,
        }}
        enabled={enabled}
        onResult={async (result) => {
          if(result){
            if (result != id) {
              id = result
              const response = await fetch(`http://localhost:3000/api/user?id=${result}`, {cache: "no-cache"})
              const data = await response.json()
              setData(data)
              console.log(data)
            }
          }
        }}
        onError={(error) => {
          console.error(error)
        }}
      />
      {
        data == null ?(
          <h1>Loading</h1>
        ) : data == true ? (
          <h1>Already Scanned</h1>
        ) : (
          <h1>Success</h1>
        )
      }
      <button onClick={() => {
        id = ""
        setData(null)
        setEnabled(true)}
      } >Scan again</button>
    </>
  )
}