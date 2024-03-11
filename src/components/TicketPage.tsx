"use client";
import TicketQR from "@/components/TicketQR";
import "./TicketPage.css";
import { createClient } from "@/utils/supabase/client";
import { Database } from "../../database.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import Bottombar from "@/components/ui/bottomBar";
import { useEffect, useState } from "react";

export default function TicketPage(props: {
  data: { id: string; locked: boolean; alias: string; role: string }[];
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient<Database>();

  useEffect(() => {
    try {
      supabase.auth.getUser().then((user) => {
        if (user && !user.error) {
          setIsLoggedIn(true);
        }
      });
    } catch (e) {
      console.error(e);
    }
    if (!isAdmin) {
      supabase
        .from("Admins")
        .select("*")
        .then(
          (response) => {
            const { data } = response;
            if (data && data.length != 0) {
              setIsAdmin(true);
            }
          },
          (error) => {
            console.error("Error:", error);
          }
        );
    }
  }, [supabase, isAdmin, isLoggedIn]);

  return (
    <>
      <div className="body">
        <div className="ticket-container">
          <div className="ticket-booking">
            <div
              style={{
                display: "flex",
                flexFlow: "row",
                margin: "15px 0 30px 0",
              }}
            >
              <div className="img-container">
                <img
                  src="krevia_x_alfaaz_Poster.png"
                  alt="loading..."
                  width="150"
                />
              </div>
              <div className="event-details">
                <p className="heading">Kreiva X Alfaaz</p>
                <p>2024</p>
                <p>Sat, 6 April | 11.00 AM</p>
                <p>Sector 11, Gandhinagar,</p>
                <p>Gujarat</p>
              </div>
            </div>
            <div className="location-section">
              <div></div>
              <div className="rectangle-nav location">
                <a href="https://maps.google.com" target="_blank">
                  Tap for venue directions
                </a>
              </div>
              <div></div>
            </div>
            <div className="qr-ticket">
              <div className="name">{props.data[0].alias}</div>
              <div className="ticket-count">
                1 Ticket (
                {props.data[0]?.role
                  ? props.data[0].role.toLowerCase()
                  : "participant"}
                )
              </div>
              <label className="qr-code">
                <input type="checkbox" className="switch-input" />
                <TicketQR id={props.data[0].id.toString()} />
              </label>
              <div className="booking-id">{props.data[0].id}</div>
            </div>
            <div className="follow-us">
              <span className="hr-line"></span>FOLLOW US
              <span className="hr-line"></span>
            </div>
            <div className="follow-us-section">
              <div className="rectangle-nav">
                <a href="https://www.instagram.com">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="https://www.twiiter.com/home">
                  <FontAwesomeIcon icon={faXTwitter} />
                </a>
                <a href="https://wwww.facebook.com">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
              </div>
            </div>
            <div className="location-section dashed">
              <div></div>
              <div className="dashed-line"></div>
              <div></div>
            </div>
            <div className="pricing-container">
              <i className="triangle"></i>
              <div className="ticket-pricing">
                <div className="heading">
                  <div className="head">
                    <span className="total-amount">Total Amount</span>
                    <span className="saved">₹690 saved</span>
                  </div>
                  <span>Rs.0.00</span>
                </div>
                <p>
                  Ticket Price (1) <span>Rs.600.00</span>
                </p>
                <p>
                  Platform fee <span>Rs.90.00</span>
                </p>
                <p>
                  IIITV student discount <span>-Rs.690.00</span>
                </p>
              </div>
            </div>
          </div>
          <div className="pricing-container">
            <i className="triangle"></i>
            <div className="ticket-pricing">
              <div className="heading">
                <div className="head">
                  Total Amount <span className="saved">₹690 saved</span>
                </div>
                <span>Rs.0.00</span>
              </div>
              <p>
                Ticket Price (1) <span>Rs.600.00</span>
              </p>
              <p>
                Platform fee <span>Rs.90.00</span>
              </p>
              <p>
                IIITV student discount <span>-Rs.690.00</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {isLoggedIn && (
        <Bottombar
          admin={isAdmin || false}
          active={
            !isAdmin
              ? "qr"
              : isAdmin && window.location.href.includes("id")
              ? "tickets"
              : "qr"
          }
        />
      )}
    </>
  );
}
