import { Database } from "../../../database.types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import FormElement from "@/components/FormPage";
import TicketPage from "@/components/TicketPage";
import Error  from "@/components/ui/Error";
import Success from "@/components/Success";

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
  if (!user && !searchParams?.id) redirect("/");

  if (searchParams?.admin) {
    const {data: admin} = await supabase.from("Admins").select("*")
    if (!admin || admin.length < 1) {
      return <Error code="403" text="Forbidden" detail="You don't have permission to access this page"/>
    }

    if (!searchParams.id) {
      return <FormElement admin={searchParams.admin.toLowerCase() === 'true'}/>;
    }

    if (searchParams.id) {
      const { data: ticketData } = await supabase
        .from("Guests")
        .select("id, locked, alias, role")
        .eq("id", searchParams.id);

      if (ticketData && ticketData.length > 0 && ticketData[0].locked == true) return <TicketPage data={ticketData} />;
      else if (ticketData && ticketData.length > 0 && ticketData[0].locked == false) return <Success id={ticketData[0].id}/>
      else return <Error code="403" text="Forbidden" detail="You don't have permission to access this page"/>
    }
  } else if (searchParams?.id) {
    // const { data: ticketData } = await supabase
    //   .from("Guests")
    //   .select("id, locked, alias, role")
    //   .eq("id", searchParams.id);

    const resp = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user?id=${searchParams.id}&notAdmin=true`, { cache: "no-cache" });
    const ticketData = await resp.json();

    if (ticketData && ticketData.length > 0 && ticketData[0].locked == true) return <TicketPage data={ticketData} />;
    else if (ticketData && ticketData.length > 0 && ticketData[0].locked == false) return <Success id={ticketData[0].id}/>
    else return <Error code="403" text="Forbidden" detail="You don't have permission to access this page"/>
  }

  const { data } = await supabase
    .from("Guests")
    .select("id, locked, alias, role");

  return data?.length != 0 && data && data[0].id && data[0].locked ? (
    <TicketPage data={data}/>
  ) : (
    <FormElement />
  );
}
