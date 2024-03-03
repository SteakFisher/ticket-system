"use client"

import {QrReader} from "react-qr-reader";
import {useState} from "react";

export default function QRComponent() {
  const [id, setId] = useState<string>("")

  return (
    <>
      {
        !id ? (
          <QrReader constraints={{facingMode: "user"}} onResult={(result, error) => {
            if(result){
              if (result.getText() !== id) {
                setId(result.getText())
              }
            }}}/>
        ) : (
          <div>
            <h1>Scanned ID: {id}</h1>
          </div>
        )
      }
    </>
  )
}