import { Database } from "../../../database.types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import FormElement from "@/components/FormPage";
import TicketPage from "@/components/TicketPage";

type FormPageProps = {
  admin?: string;
  id?: string;
}

export default async function FormPage({
    params,
    searchParams,
  } : {
  params: { slug: string }
  searchParams: FormPageProps | undefined
}) {
  const supabase = createClient<Database>();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  if (searchParams?.admin && !searchParams?.id) {
    return <FormElement admin={searchParams.admin.toLowerCase() === 'true'}/>;
  }

  const { data } = await supabase
    .from("Guests")
    .select("id, locked, alias, role");

  return data?.length != 0 && data && data[0].id && data[0].locked ? (
    <TicketPage data={data} />
  ) : (
    <FormElement />
  );
}
