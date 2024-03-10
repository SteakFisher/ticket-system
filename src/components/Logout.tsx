"use client"
import { usePathname } from 'next/navigation'
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function Logout() {
  const pathname = usePathname()

  if (pathname !== "/") {
    return (
      <Button>
        <Link href={"/api/logout"}>Logout</Link>
      </Button>
    )
  } else {
    return null
  }
}