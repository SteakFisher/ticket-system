import { Database } from "../../../database.types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import FormElement from "@/components/FormPage";
import TicketPage from "@/components/TicketPage";

export default async function FormPage() {
  const supabase = createClient<Database>();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data } = await supabase
    .from("Guests")
    .select("id, locked, alias, role");

  return data?.length != 0 && data && data[0].id && data[0].locked ? (
    <TicketPage data={data} />
  ) : (
    <FormElement />
  );
}
