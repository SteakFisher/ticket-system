"use client";
import TicketQR from "@/components/TicketQR";
import "./TicketPage.css";
import Footer from "@/components/ui/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import Bottombar from "@/components/ui/bottomBar";
import { useEffect, useState } from "react";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { isUserAdmin } from "@/actions/tickets";
import { useSession } from "next-auth/react";

export default function TicketPage(props: {
  data: { id: string; locked: boolean; alias: string; role: string }[];
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const adminStatus = await isUserAdmin();
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    if (isLoggedIn) {
      checkAdmin();
    }
  }, [isLoggedIn]);

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
                <a
                  href="mailto:academics_committee@iiitvadodara.ac.in"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                </a>
                <a href="tel:+91 9531852385" target="_blank" rel="noreferrer">
                  <FontAwesomeIcon icon={faPhone} />
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
            <Footer />
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
