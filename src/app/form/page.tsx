import {Database} from "../../../database.types";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import FormElement from "@/components/FormPage";
import TicketQR from "@/components/TicketQR";


export default async function FormPage() {
  const supabase = createClient<Database>()

  const {data: {user}} = await supabase.auth.getUser();
  if (!user) redirect("/")

  const {data} = await supabase.from("Guests").select("id, locked, alias, role")

  return (
    (data?.length == 0) ? <FormElement /> : !data ? <FormElement /> : data[0].id && !data[0].locked ? redirect("/form/success") : data[0].locked ? (
      <>
        <h1>{data[0].alias}</h1>
        <h1>{data[0].role}</h1>
        <h1>{data[0].id}</h1>
        <TicketQR id={data[0].id}/>
      </>
    ) : null
  )
}
