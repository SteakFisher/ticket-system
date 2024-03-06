"use client"

import {QRCode} from "react-qrcode-logo";

export default function TicketQR({ id }: { id: string}) {
  return (
    <QRCode
      removeQrCodeBehindLogo={true}
      logoImage={"/Kreiva_X_Alfaaz_Red.png"}
      logoOpacity={1}
      logoHeight={200}
      logoWidth={200}
      logoPadding={1}
      logoPaddingStyle={"circle"}
      size={512}
      value={id}
      ecLevel={"H"}
      fgColor={"#7f0019"}
      bgColor={"#ffffff"}
      eyeRadius={[
        {
          outer: [10, 10, 0, 10],
          inner: [1, 1, 0, 1],
        },
        {
          outer: [10, 10, 10, 0],
          inner: [1, 1, 1, 0],
        },
        {
          outer: [10, 0, 10, 10],
          inner: [1, 0, 1, 1],
        },
      ]}
      qrStyle={"dots"}
    />
  )
}