import {createClient} from "@/utils/supabase/server";
import {Database} from "../../../database.types";
import ScannerComponent from "@/components/Scanner";
import Error403 from "../../components/ui/Error403";

export default async function Scanner() {
  const supabase = createClient<Database>()
  const {data} = await supabase.from("Admins").select("*")

  if (data && data.length != 0) {
    return (
      <ScannerComponent />
    )
  } else {
    return (<Error403 />)
  }
}