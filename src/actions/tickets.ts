"use server";

import { db } from "@/db";
import { guests, admins } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createTicket(data: {
  alias: string;
  altEmail: string;
  isVeg: boolean;
  email?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Check if user is admin
  const [isAdmin, existingTicket] = await Promise.all([
    db.query.admins.findFirst({
      where: eq(admins.id, session.user.id),
    }),
    db.query.guests.findFirst({
      where: and(
        eq(guests.authId, session.user.id),
        eq(guests.alias, data.alias),
      ),
    }),
  ]);

  if (existingTicket && !isAdmin) {
    throw new Error("You already have a ticket with this alias");
  }

  const ticketData = {
    alias: data.alias,
    altEmail: data.altEmail,
    isVeg: data.isVeg,
    email: data.email || session.user.email || "",
    authId: session.user.id,
    locked: false,
    scanned: false,
    role: "",
  };

  const [ticket] = await db.insert(guests).values(ticketData).returning();

  revalidatePath("/form");
  return ticket;
}

export async function getMyTickets() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  // Check if user is admin
  const isAdmin = await db.query.admins.findFirst({
    where: eq(admins.id, session.user.id),
  });

  if (isAdmin) {
    // Admins can see all tickets
    const allTickets = await db.query.guests.findMany({
      orderBy: (guests, { desc }) => [desc(guests.createdAt)],
      where: eq(guests.authId, session.user.id),
    });
    return allTickets;
  } else {
    // Regular users see only their tickets
    const userTickets = await db.query.guests.findFirst({
      where: eq(guests.authId, session.user.id),
    });
    return [userTickets];
  }
}

export async function getTicketById(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const ticket = await db.query.guests.findFirst({
    where: eq(guests.id, id),
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  // Check if user has access to this ticket
  const isAdmin = await db.query.admins.findFirst({
    where: eq(admins.id, session.user.id),
  });

  if (!isAdmin && ticket.authId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  return ticket;
}

export async function scanTicket(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Only admins can scan tickets
  const isAdmin = await db.query.admins.findFirst({
    where: eq(admins.id, session.user.id),
  });

  if (!isAdmin) {
    throw new Error("Unauthorized - Admin only");
  }

  const ticket = await db.query.guests.findFirst({
    where: eq(guests.id, id),
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  if (ticket.scanned) {
    return { alreadyScanned: true, ticket };
  }

  const [updatedTicket] = await db
    .update(guests)
    .set({ scanned: true })
    .where(eq(guests.id, id))
    .returning();

  revalidatePath("/scanner");
  revalidatePath("/tickets");
  return { alreadyScanned: false, ticket: updatedTicket };
}

export async function getAllTickets() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Only admins can see all tickets
  const isAdmin = await db.query.admins.findFirst({
    where: eq(admins.id, session.user.id),
  });

  if (!isAdmin) {
    throw new Error("Unauthorized - Admin only");
  }

  const allTickets = await db.query.guests.findMany({
    orderBy: (guests, { desc }) => [desc(guests.createdAt)],
  });

  return allTickets;
}

export async function isUserAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return false;
  }

  const admin = await db.query.admins.findFirst({
    where: eq(admins.id, session.user.id),
  });

  return !!admin;
}
