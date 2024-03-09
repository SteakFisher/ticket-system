import TicketQR from "@/components/TicketQR";
import "./TicketPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function TicketPage(props: {
  data: { id: string; locked: boolean; alias: string | null; role: string; }[];
}) {
  return (
    <>
    <div className="body">
    <div className="ticket-container">
        <div className="ticket-booking">
            <div className="img-container">
                <img src="krevia_x_alfaaz_Poster.png" alt="loading..." width="150" />
            </div>
            <div className="event-details">
                <p className="heading">Krevia X Alfaaz</p>
                <p>2024</p>
                <p>Sat, 6 April | 11.00 AM</p>
                <p>Sector 11, Gandhinagar,</p>
                <p>Gujarat</p>
            </div>
            <div className="location-section">
                <div></div>
                <div className="rectangle-nav location"><a href="https://maps.google.com" target="_blank">Tap for location directions</a></div>
                <div></div>
            </div>
            <div className="qr-ticket">
                <div className="name">{props.data[0].alias}<sub style={{fontSize: "x-small"}}>{props.data[0].role}</sub></div>
                <div className="ticket-count">1 Ticket (Student)</div>
                <label className="qr-code" >
                    <input type="checkbox" className="switch-input"/>
                    <TicketQR id={props.data[0].id.toString()}/>
                </label>
                {/* <!-- <img src="src/qr_code.svg" alt="loading..." className="qr-code" width="100px"/> --> */}
                <div className="booking-id">BOOKING ID: {props.data[0].id}</div>
            </div>
            <div className="follow-us"><span className="hr-line"></span>FOLLOW US<span className="hr-line"></span></div>
            <div className="follow-us-section">
                <div className="rectangle-nav">
                    <a href="https://www.instagram.com"><FontAwesomeIcon icon={faInstagram} /></a>
                    <a href="https://www.twiiter.com/home"><FontAwesomeIcon icon={faXTwitter} /></a>
                    <a href="https://wwww.facebook.com"><FontAwesomeIcon icon={faFacebook} /></a>
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
                        <div className="head"><span className="total-amount">Total Amount</span><span className="saved">₹690 saved</span></div><span>Rs.0.00</span>
                    </div>
                    <p>Ticket Price (1) <span>Rs.600.00</span></p>
                    <p>Platform fee <span>Rs.90.00</span></p>
                    <p>IIITY student discount <span>-Rs.690.00</span></p>
                </div>
            </div>
        </div>
        <div className="pricing-container">
            <i className="triangle"></i>
            <div className="ticket-pricing">
                <div className="heading">
                    <div className="head">Total Amount <span className="saved">₹690 saved</span></div><span>Rs.0.00</span>
                </div>
                <p>Ticket Price (1) <span>Rs.600.00</span></p>
                <p>Platform fee <span>Rs.90.00</span></p>
                <p>IIITY student discount <span>-Rs.690.00</span></p>
            </div>
        </div>
    </div>
      {/* <h1>{props.data[0].alias}</h1>
      <h1>{props.data[0].role}</h1>
      <h1>{props.data[0].id}</h1>
      <TicketQR id={props.data[0].id.toString()} /> */}
      </div>
    </>
  );
}
