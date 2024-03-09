"use client";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import "../components/formCss.css";
import { useState } from "react";
import Socials from "@/components/ui/Socials";
import tSystemLogo from "../../public/TicketSystemLogo.png";
import userIllustration from "../../public/User--KreivaXAlfaaz.svg";
import google from "../../public/Google.svg";
import { set } from "react-hook-form";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  return (
    <div className="loginForm" style={loading ? {aspectRatio: 1} : {}}>
      <div
        style={
          loading
            ? {
                position: "absolute",
                bottom: 0,
                top: 0,
                height: "120px",
                width: "88px",
                left: 0,
                right: 0,
                margin: "auto",
              }
            : { position: "relative" }
        }
      >
        <div
          className="loader"
          style={{ display: `${loading ? "block" : "none"}` }}
        ></div>
        <Image src={tSystemLogo} className={ 'logoTall ' + (loading && "inLoader") } alt="logo" height="120" />
      </div>
      { loading ? "" : <>
      <h1>Authentication</h1>

      <Image
        src={userIllustration}
        alt="User -- Kreiva X Alfaaz"
        height="70"
        style={{ margin: "30px 0 50px 0" }}
      />
      <h2>Hello,</h2>
      <h3>
        You need to verify with ticket-system for accessing Kreiva X Alfaaz.
      </h3>
      <button
        className="loginBtn"
        onClick={async () => {
          setLoading(true);
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${location.origin}/auth/callback/`,
            },
          });
        }}
      >
        <Image src={google} alt="G" height="40" />
        <span>Continue with Google</span>
      </button>
      <div className="followBackground">
        <span className="follow">FOLLOW US</span>
      </div>
      <Socials />
      </> }
    </div>
  );
}
