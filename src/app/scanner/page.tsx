import {createClient} from "@/utils/supabase/server";
import {Database} from "../../../database.types";
import ScannerComponent from "@/components/Scanner";
import Error from "../../components/ui/Error";

export default async function Scanner() {
  const supabase = createClient<Database>()
  const {data} = await supabase.from("Admins").select("*")

  if (data && data.length != 0) {
    return (
      <ScannerComponent />
    )
  } else {
    return (<Error code="403" text="Forbidden" detail="You don't have permission to access this page"/>)
  }
}