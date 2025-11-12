import { auth } from "@/auth";
import { db } from "@/db";
import { admins, guests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Error from "@/components/ui/Error";
import TicketsDisplay from "@/components/TicketsDisplay";
import { getMyTickets, isUserAdmin } from "@/actions/tickets";

export default async function TicketsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  // Check if user is admin
  const isAdmin = await isUserAdmin();

  if (!isAdmin) {
    return (
      <Error
        code="403"
        text="Forbidden"
        detail="You don't have permission to access this page"
      />
    );
  }

  // Get all tickets for admin
  const allTickets = await getMyTickets();

  return <TicketsDisplay tickets={allTickets || []} />;
}
