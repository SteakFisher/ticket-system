"use client";

import Image from "next/image";
import home from "../../../public/svg/Home.svg";
import home_active from "../../../public/svg/Home_Active.svg";
import Out from "../../../public/svg/Out.svg";
import Scan from "../../../public/svg/Scan.svg";
import Share from "../../../public/svg/Share.svg";
// import Share_Active from "../../../public/svg/Share_Active.svg";
import Tickets_Active from "../../../public/svg/Tickets_Active.svg";
import Tickets from "../../../public/svg/Tickets.svg";
import User from "../../../public/svg/User.svg";
import User_Active from "../../../public/svg/User_Active.svg";
import Website from "../../../public/svg/Website.svg";
import "./bottomBar.css";
import { createClient } from "@/utils/supabase/client";
import { RWebShare } from "react-web-share";
import Link from "next/link";

const BottomBar = (props: { admin: boolean; active: String }) => {
  const supabase = createClient();
  return (
    <>
      <div className="bottomBarBack"></div>
      <div className="bottomBar">
        <div className="centerBack"></div>
        <div className="center">
          {props.admin ? (
            <Link href={"/scanner"}>
              <Image
                src={Scan}
                alt="Scan"
                // onClick={() => {
                //   window.open("/scanner", "_self");
                // }}
              />
            </Link>
          ) : (
            <Image
              src={Website}
              alt="Website"
              onClick={() => {
                window.open(
                  "https://something.com/nothing#Kreiva-X-Akfaaz",
                  "_blank"
                );
              }}
            />
          )}
        </div>
        <div className="icons">
          <div className="left">
            <Link href={props.admin ? "/form?admin=true" : "/form"}>
              <Image
                src={props.active !== "form" ? home : home_active}
                alt="Home"
                className={props.active === "form" ? "active" : ""}
                // onClick={() => {
                //   window.open(
                //     props.admin ? "/form?admin=true" : "/form",
                //     "_self"
                //   );
                // }}
              />
            </Link>
            {props.admin ? (
              <Link href={"/tickets"}>
                <Image
                  src={props.active !== "tickets" ? Tickets : Tickets_Active}
                  alt="Tickets"
                  className={props.active === "tickets" ? "active" : ""}
                  // onClick={() => {
                  //   window.open("/tickets", "_self");
                  // }}
                />
              </Link>
            ) : (
              <Link href={"/form"}>
                <Image
                  src={props.active !== "qr" ? User : User_Active}
                  alt="User"
                  className={props.active === "qr" ? "active" : ""}
                  // onClick={() => {
                  //   window.open("/form", "_self");
                  // }}
                />
              </Link>
            )}
          </div>
          <div className="right">
            {props.admin ? (
              <Link href={"/form"}>
                <Image
                  src={props.active !== "qr" ? User : User_Active}
                  alt="User"
                  className={props.active === "qr" ? "active" : ""}
                  // onClick={() => {
                  //   window.open("/form", "_self");
                  // }}
                />
              </Link>
            ) : (
              <RWebShare
                data={{
                  text: "The most anticipated event of the year is here... Don't miss out on the fun - reserve your spot now!",
                  url: "https://something.com/nothing",
                  title: "Kreiva X ALfaaz",
                }}
                onClick={() => console.log("shared successfully!")}
              >
                <Image src={Share} alt="Share" />
              </RWebShare>
            )}
            <Link href={"/"} onClick={async (e) => await supabase.auth.signOut()}>
              <Image
                src={Out}
                alt="Logout"
                // onClick={async () => {
                //   const { error } = await supabase.auth.signOut();
                //   console.error(error);
                //   window.open("/", "_self");
                // }}
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomBar;
