import Image from "next/image";
import logoTall from "../../public/KreivaXAlfaazLogo_tall.png";
import "./formCss.css";
import Bottombar from "@/components/ui/bottomBar";
import Footer from "@/components/ui/Footer";

export default function Success({
  loggedIn,
  isAdmin,
  id,
}: {
  id: string;
  loggedIn: boolean;
  isAdmin: boolean;
}) {
  return (
    <>
      <div>
        <form className="space-y-8 ticketForm">
          <div style={{ position: "relative" }}>
            <div className="loader" style={{ display: "none" }}></div>
            <Image src={logoTall} alt="logo" height="120" />
          </div>

          <h1 className="text-3xl font-bold" style={{ display: `${"block"}` }}>
            Kreiva X Alfaaz
          </h1>
          <>
            <h2>
              Congratulations! Your ticket has been successfully generated.
              You&apos;ll receive access to your ticket approximately two hours
              before the event. In the meantime, why not start practicing some
              killer dance moves to dazzle your friends on the dance floor?
            </h2>
            <h3>
              BOOKING ID: <br />
              {id}
            </h3>
            <Footer />
          </>
        </form>
      </div>
      {loggedIn && (
        <Bottombar
          admin={isAdmin || false}
          active={
            !isAdmin
              ? "qr"
              : "tickets"
          }
        />
      )}
    </>
  );
}
