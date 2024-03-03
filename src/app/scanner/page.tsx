import {createClient} from "@/utils/supabase/server";
import {Database} from "../../../database.types";
import ScannerComponent from "@/components/Scanner";

export default async function Scanner() {
  const supabase = createClient<Database>()
  const {data} = await supabase.from("Admins").select("*")

  if (data && data.length != 0) {
    return (
      <ScannerComponent />
    )
  } else {
    return (<h1>No Access</h1>)
  }
}