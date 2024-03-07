"use client";

import { useState } from "react";
import QrScanner from "qr-scanner";
import "./Scanner.css";

let id = "";

export default function QRComponent() {
  const [enabled, setEnabled] = useState(true);
  const [data, setData] = useState<any | null>(null);

  const scan = async () => {
    setEnabled(false);
    const video = document.createElement("video");
    document.getElementsByClassName("scannerFrame")[0].appendChild(video);
    const qrScanner = new QrScanner(
      video,
      async (result) => {
        if (result.data) {
          qrScanner.destroy();
          video.remove();
          if (result.data != id) {
            id = result.data;
            const response = await fetch(
              `${location.origin}/api/user?id=${result.data}`,
              { cache: "no-cache" }
            );
            try {
              const data = await response.json();
              setData(data);
              console.log(data);
            } catch (e) {
              console.error(e);
              setData("Error");
            }
          } else {
            setData(true);
          }
          setEnabled(true);
        } else {
          console.log("No QR code found");
        }
      },
      { highlightScanRegion: true, returnDetailedScanResult: true }
    );
    qrScanner.start();
  };

  return (
    <div>
      <img
        src="Kreiva_X_Alfaaz_Techno.png"
        id="TechnoLogo"
        alt="Kreiva_X_Alfaaz_Techno"
      />
      <div className="scannerFrame"></div>
      {enabled && (
        <div className="currentStatus">
          {data == null ? (
            <div></div>
          ) : data == true ? (
            <div>{alert("Error: Ticket Already Scanned.") + ""}</div>
          ) : data == false ? (
            <h1>Success!</h1>
          ) : (
            <div>{alert("Error: Internal Server Error.") + ""}</div>
          )}
        </div>
      )}
      {enabled && <div className="fakeScanner"></div>}
      {enabled && (
        <button onClick={scan} id="startScanning">
          Start Scanning
        </button>
      )}
    </div>
  );

  // return (
  //   <>
  //     <Scanner
  //       components={{
  //         audio: false,
  //       }}
  //       enabled={enabled}
  //       onResult={async (result) => {
  //         if(result){
  //           if (result != id) {
  //             id = result
  //             const response = await fetch(`${location.origin}/api/user?id=${result}`, {cache: "no-cache"})
  //             const data = await response.json()
  //             setData(data)
  //             console.log(data)
  //           }
  //         }
  //       }}
  //       onError={(error) => {
  //         console.error(error)
  //       }}
  //     />
  //     {
  //       data == null ?(
  //         <h1>Loading</h1>
  //       ) : data == true ? (
  //         <h1>Already Scanned</h1>
  //       ) : (
  //         <h1>Success</h1>
  //       )
  //     }
  //     <button onClick={() => {
  //       id = ""
  //       setData(null)
  //       setEnabled(true)}
  //     } >Scan again</button>
  //   </>
  // )
}
