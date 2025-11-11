"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChain, faArrowTurnDown } from "@fortawesome/free-solid-svg-icons";
import logoTechno from "../../public/Kreiva_X_Alfaaz_Techno.png";
import "../app/tickets/page.css";
import Bottombar from "@/components/ui/bottomBar";
import type { Guest } from "@/db/schema";

type TicketsDisplayProps = {
  tickets: Guest[];
};

export default function TicketsDisplay({ tickets }: TicketsDisplayProps) {
  return (
    <div className="tickets">
      <div className="ticketsHeader">
        <Image src={logoTechno} alt="Kreiva X Alfaaz logo" />
        <button>
          <FontAwesomeIcon icon={faChain} />
          <Link href="/form?admin=true">Back to Form</Link>
        </button>
      </div>
      <div className="ticketsList">
        <div className="ticketsListHeader">
          <h1>Your Bookings</h1>
          <FontAwesomeIcon icon={faArrowTurnDown} />
        </div>
        {tickets.length === 0 ? (
          <div className="ticketLink">
            <h1>No tickets found</h1>
          </div>
        ) : (
          tickets.map((guest) => {
            return (
              <div className="ticketLink" key={guest.id}>
                <Link href={`/form?id=${guest.id}`}>
                  <h1>
                    {guest.alias} ({guest.altEmail}) ~
                    {guest.role ? " " + guest.role.toLowerCase() : " participant"}
                  </h1>
                </Link>
              </div>
            );
          })
        )}
      </div>
      <Bottombar admin={true} active="tickets" />
    </div>
  );
}
