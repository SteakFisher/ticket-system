import {Database} from "../../../database.types";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import FormElement from "@/components/FormPage";
import QRCode from "react-qr-code";


export default async function FormPage() {
  const supabase = createClient<Database>()

  const {data: {user}} = await supabase.auth.getUser();
  if (!user) redirect("/")

  const {data, error} = await supabase.from("Guests").select("id, locked")

  return (
    (data?.length == 0) ? <FormElement /> : !data ? <FormElement /> : data[0].id && !data[0].locked ? redirect("/form/success") : data[0].locked ? (
      <div className={"p-6 bg-white"}>
        <h1>Already Submitted</h1>
        <p>You've already submitted your form. We'll see you at the event!</p>
        <QRCode value={data[0].id} />
      </div>
    ) : null
  )
}
