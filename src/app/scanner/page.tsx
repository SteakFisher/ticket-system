import { auth } from "@/auth";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ScannerComponent from "@/components/ScannerComponent";
import Error from "@/components/ui/Error";

export default async function Scanner() {
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

  return <ScannerComponent />;
}
