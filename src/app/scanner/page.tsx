"use client"
import { QrReader } from 'react-qr-reader';

export default function Scanner() {
  return (
    <div>
      <h1>Scanner</h1>
      <p>Scan the QR code to check in.</p>
      <QrReader constraints={{facingMode: "user"}} onResult={(e) => {
        if(e?.toString()) {
          alert(e?.toString())

      }}}/>
    </div>
  )
}