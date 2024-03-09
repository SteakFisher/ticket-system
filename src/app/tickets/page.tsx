import {createClient} from "@/utils/supabase/server";
import {Database} from "../../../database.types";
import Error from "@/components/ui/Error";
import Link from "next/link";

export default async function Ticket() {
  const supabase = createClient<Database>()
  const {data} = await supabase.from("Admins").select("*")

  if (data && data.length != 0) {
    const { data } = await supabase
      .from("Guests")
      .select("id, alias, altEmail");



    return (
      <>
        {
          data?.map((guest) => {
            return (
              <Link href={`/form?id=${guest.id}&admin=true`} key={guest.id}>
                <div key={guest.id}>
                  <h1>{guest.alias}</h1>
                  <h1>{guest.altEmail}</h1>
                </div>
              </Link>
            )
          })
        }
        <button>
          <Link href="/form?admin=true">Form</Link>
        </button>
      </>
    )
  } else {
    return (<Error code="403" text="Forbidden" detail="You don't have permission to access this page"/>)
  }
}