import {createClient} from "@/utils/supabase/server";
import {Database} from "../../../database.types";
import ScannerComponent from "@/components/Scanner";
import Error from "@/components/ui/Error";
import Link from "next/link";

export default async function Ticket() {
  const supabase = createClient<Database>()
  const {data} = await supabase.from("Admins").select("*")

  if (data && data.length != 0) {
    const { data } = await supabase
      .from("Guests")
      .select("id, locked, alias, role");



    return (
      <>
        <button>
          <Link href="/form">Form</Link>
        </button>
      </>
    )
  } else {
    return (<Error code="403" text="Forbidden" detail="You don't have permission to access this page"/>)
  }
}