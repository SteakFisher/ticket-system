import { createClient } from "@/utils/supabase/server";
import { Database } from "../../../database.types";
import Error from "@/components/ui/Error";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChain, faArrowTurnDown } from "@fortawesome/free-solid-svg-icons";
import logoTechno from "../../../public/Kreiva_X_Alfaaz_Techno.png";
import "./page.css";
import Bottombar from "@/components/ui/bottomBar";

export default async function Ticket() {
  const supabase = createClient<Database>();
  const { data } = await supabase.from("Admins").select("*");

  if (data && data.length != 0) {
    const { data } = await supabase
      .from("Guests")
      .select("id, alias, altEmail, role");

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
          {data?.map((guest) => {
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
          })}
        </div>
        <Bottombar admin={true} active="tickets" />
      </div>
    );
  } else {
    return (
      <Error
        code="403"
        text="Forbidden"
        detail="You don't have permission to access this page"
      />
    );
  }
}
