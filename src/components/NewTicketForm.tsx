"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "./formCss.css";
import Socials from "@/components/ui/Socials";
import Footer from "@/components/ui/Footer";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import Bottombar from "@/components/ui/bottomBar";
import { createTicket, getMyTickets } from "@/actions/tickets";

import logoTall from "../../public/KreivaXAlfaazLogo_tall.png";

const formSchema = z.object({
  alias: z
    .string()
    .min(2, {
      message: "Alias must be at least 2 characters.",
    })
    .max(12, {
      message: "Alias must be at most 12 characters.",
    })
    .regex(new RegExp("^\\w+$")),
  altEmail: z.string().email({ message: "Invalid email address" }),
});

export default function NewTicketForm({
  admin,
  id,
  isAdmin: initialIsAdmin,
  userEmail,
}: {
  admin?: boolean;
  id?: string;
  isAdmin?: boolean;
  userEmail?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [userdata, setData] = useState<any>(id ? [{ id }] : null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(admin || initialIsAdmin);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      alias: "",
      altEmail: "",
    },
  });

  const { watch } = form;
  const aliasValue = watch("alias");
  const altEmailValue = watch("altEmail");

  const router = useRouter();

  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsAdmin(admin || initialIsAdmin);

    const checkTicket = async () => {
      try {
        const tickets = await getMyTickets();
        if (tickets && tickets.length > 0) {
          setData(tickets);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
      setIsLoading(false);
    };

    if (!admin && !id) {
      checkTicket();
    } else {
      setIsLoading(false);
    }
  }, [admin, id, initialIsAdmin]);

  return isLoading ? (
    ""
  ) : (
    <>
      <Form {...form}>
        <Toaster position="top-right" reverseOrder={false} />
        <form
          onSubmit={form.handleSubmit(async (e) => {
            setLoading(true);
            setIsDisabled(true);

            try {
              const ticket = await createTicket({
                alias: e.alias,
                altEmail: e.altEmail,
                isVeg: true,
                email: userEmail,
              });

              setData([ticket]);
              toast.success("Ticket created successfully!");
            } catch (error) {
              console.error("Error creating ticket:", error);
              toast.error(
                "An error occurred. Please try again or contact administrator.",
              );
              setIsDisabled(false);
            }

            setLoading(false);
          })}
          className="space-y-8 ticketForm"
          style={
            loading
              ? { position: "absolute", top: "0", bottom: "0", margin: "auto" }
              : {}
          }
        >
          <div
            style={
              loading
                ? {
                    position: "absolute",
                    bottom: 0,
                    top: 0,
                    height: "120px",
                    width: "88px",
                    left: 0,
                    right: 0,
                    margin: "auto",
                  }
                : { position: "relative" }
            }
          >
            <div
              className="loader"
              style={{ display: `${loading ? "block" : "none"}` }}
            ></div>
            <Image src={logoTall} alt="logo" height="120" />
          </div>

          <h1
            className="text-3xl font-bold"
            style={{ display: `${!loading ? "block" : "none"}` }}
          >
            Kreiva X Alfaaz
          </h1>
          {loading || userdata ? (
            userdata ? (
              <>
                <h2>
                  Congratulations! Your ticket has been successfully generated.
                  You&apos;ll receive access to your ticket approximately one
                  week before the event. In the meantime, why not start
                  practicing some killer dance moves to dazzle your friends on
                  the dance floor?
                </h2>
                <h3>
                  BOOKING ID: <br />
                  {userdata[0].id}
                </h3>
              </>
            ) : (
              ""
            )
          ) : (
            <>
              <h2 className="text-xl font-semibold">
                Don&apos;t miss out on the fun - reserve your spot now!
              </h2>
              <FormField
                control={form.control}
                name="alias"
                render={({ field }) => (
                  <div>
                    <FormItem
                      className={`longInput ${aliasValue ? "has-value" : ""}`}
                    >
                      <FormLabel>Alias</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                    <FormMessage />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="altEmail"
                render={({ field }) => (
                  <div>
                    <FormItem
                      className={`longInput ${
                        altEmailValue ? "has-value" : ""
                      }`}
                    >
                      <FormLabel>Alternate Email</FormLabel>
                      <FormControl>
                        <Input type={"email"} {...field} />
                      </FormControl>
                    </FormItem>
                    <FormMessage />
                  </div>
                )}
              />
              <Button
                type="submit"
                disabled={isDisabled}
                className="ticketButton"
              >
                Get Ticket
              </Button>
              <div className="followBackground">
                <span className="follow">FOLLOW US</span>
              </div>
              <Socials />
              <Footer />
            </>
          )}
        </form>
      </Form>
      <Bottombar
        admin={isAdmin || false}
        active={
          !isAdmin
            ? userdata
              ? "qr"
              : "form"
            : !userdata
              ? "form"
              : typeof window !== "undefined" &&
                  window.location.href.includes("admin=true")
                ? "tickets"
                : "qr"
        }
      />
    </>
  );
}
