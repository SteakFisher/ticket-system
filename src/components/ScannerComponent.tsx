"use client";

import { useState } from "react";
import QrScanner from "qr-scanner";
import "./Scanner.css";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { scanTicket } from "@/actions/tickets";

import logoTechno from "../../public/Kreiva_X_Alfaaz_Techno.png";
import Bottombar from "@/components/ui/bottomBar";

let lastScannedId = "";

export default function ScannerComponent() {
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

          if (result.data !== lastScannedId) {
            lastScannedId = result.data;

            try {
              // Extract ticket ID from URL or use directly
              const ticketId = result.data.includes("id=")
                ? result.data.split("id=")[1].split("&")[0]
                : result.data;

              const scanResult = await scanTicket(ticketId);

              if (scanResult.alreadyScanned) {
                setData(true); // Already scanned
                toast.error("Ticket Already Scanned!");
              } else {
                setData(false); // Successfully scanned
                toast.success("Ticket Scanned Successfully!");
              }
            } catch (error: any) {
              console.error("Scan error:", error);
              setData("Error");
              toast.error(error.message || "Error scanning ticket");
            }
          } else {
            setData(true);
            toast.error("Ticket Already Scanned!");
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

  const handleError = (error: string) => {
    return <h1 className="error-message">{error}</h1>;
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexFlow: "column",
          paddingBottom: "130px",
          maxWidth: "650px",
          margin: "auto",
          minWidth: "350px",
        }}
      >
        <Toaster position="bottom-center" reverseOrder={false} />
        <Image
          src="/Kreiva_X_Alfaaz_Techno.png"
          id="TechnoLogo"
          alt="Kreiva_X_Alfaaz_Techno"
          height={100}
          width={300}
        />
        <div className="scannerFrame"></div>
        {enabled && (
          <div className="currentStatus">
            {data === null ? (
              <div></div>
            ) : data === true ? (
              handleError("Error: Ticket Already Scanned.")
            ) : data === false ? (
              <h1>Success!</h1>
            ) : (
              handleError("Error: Internal Server Error.")
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
      <Bottombar admin={true} active="scanner" />
    </>
  );
}
