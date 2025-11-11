import { auth } from "@/auth";
import { db } from "@/db";
import { admins, guests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Error from "@/components/ui/Error";
import TicketsDisplay from "@/components/TicketsDisplay";

export default async function TicketsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  // Check if user is admin
  const isAdmin = await db.query.admins.findFirst({
    where: eq(admins.id, session.user.id),
  });

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
  const allTickets = await db.query.guests.findMany({
    orderBy: (guests, { desc }) => [desc(guests.createdAt)],
  });

  return <TicketsDisplay tickets={allTickets} />;
}
