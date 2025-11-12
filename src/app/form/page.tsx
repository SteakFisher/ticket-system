import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { guests, admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import NewTicketForm from "@/components/NewTicketForm";
import TicketPage from "@/components/TicketPage";
import Success from "@/components/Success";
import Error from "@/components/ui/Error";
import { isUserAdmin } from "@/actions/tickets";

type FormPageProps = {
  admin?: string;
  id?: string;
};

export default async function FormPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: FormPageProps | undefined;
}) {
  const session = await auth();

  // Redirect to login if not authenticated and no ticket ID
  if (!session?.user && !searchParams?.id) {
    redirect("/");
  }

  // Check if user is admin
  const isAdmin = await isUserAdmin()

  // Admin-specific routes
  if (searchParams?.admin) {
    if (!isAdmin) {
      return (
        <Error
          code="403"
          text="Forbidden"
          detail="You don't have permission to access this page"
        />
      );
    }

    // Admin creating a new ticket
    if (!searchParams.id) {
      return (
        <NewTicketForm
          admin={true}
          isAdmin={true}
          userEmail={session?.user?.email || ""}
        />
      );
    }

    // Admin viewing a specific ticket
    if (searchParams.id) {
      const ticketData = await db.query.guests.findFirst({
        where: eq(guests.id, searchParams.id),
      });

      if (!ticketData) {
        return <Error code="404" text="Not Found" detail="Ticket not found" />;
      }

      if (ticketData.locked) {
        return <TicketPage data={[ticketData]} />;
      } else {
        return <Success id={ticketData.id} loggedIn={true} isAdmin={true} />;
      }
    }
  }

  // Public ticket view (via QR code or link)
  if (searchParams?.id) {
    const ticketData = await db.query.guests.findFirst({
      where: eq(guests.id, searchParams.id),
    });

    if (!ticketData) {
      return <Error code="404" text="Not Found" detail="Ticket not found" />;
    }

    // Check if the ticket was created by an admin
    const ticketCreatedByAdmin = ticketData.authId
      ? await db.query.admins.findFirst({
          where: eq(admins.id, ticketData.authId),
        })
      : null;

    // Check if user has access to this ticket
    const hasAccess =
      isAdmin || // Current user is admin
      (session?.user?.id && ticketData.authId === session.user.id) || // User created this ticket
      ticketCreatedByAdmin; // Ticket was created by an admin (shareable)

    // If no access and not created by admin, deny
    if (!hasAccess) {
      return (
        <Error
          code="403"
          text="Forbidden"
          detail="You don't have permission to access this ticket"
        />
      );
    }

    // If ticket is locked, show it
    if (ticketData.locked) {
      return <TicketPage data={[ticketData]} />;
    } else {
      // If ticket is not locked yet, show the success/waiting page
      return (
        <Success
          id={ticketData.id}
          loggedIn={!!session?.user}
          isAdmin={!!isAdmin}
        />
      );
    }
  }

  // Regular user flow - check if they have existing tickets
  if (session?.user?.id) {
    const userTickets = await db.query.guests.findMany({
      where: eq(guests.authId, session.user.id),
    });

    if (userTickets.length > 0 && userTickets[0].locked) {
      return <TicketPage data={userTickets} />;
    }
  }

  // Show new ticket form
  return (
    <NewTicketForm
      admin={false}
      isAdmin={!!isAdmin}
      userEmail={session?.user?.email || ""}
    />
  );
}
