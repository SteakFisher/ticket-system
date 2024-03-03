import {Database} from "../../../database.types";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import FormElement from "@/components/FormPage";


export default async function FormPage() {
  const supabase = createClient<Database>()
  const {data, error} = await supabase.from("Guests").select("id, locked")

  console.log(data)

  return (
    (data?.length == 0) ? <FormElement /> : !data ? <FormElement /> : data[0].id ? redirect("/form/success") : null
  )
}
