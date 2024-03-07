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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Database } from "../../database.types";
import "./formCss.css";
import Socials from "@/components/ui/Socials";
import toast, { Toaster } from "react-hot-toast";
import Image from 'next/image'

import logoTall from "../../public/KreivaXAlfaazLogo_tall.png"

const formSchema = z.object({
  alias: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(12, {
      message: "Name must be at most 12 characters.",
    })
    .regex(new RegExp("^\\w+$")),
  altEmail: z.string().email({ message: "Invalid email address" }),
  isVeg: z.string(),
});

export default function FormElement() {
  const [loading, setLoading] = useState(false);
  const [userdata, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      alias: "",
      altEmail: "",
      isVeg: "true",
    },
  });

  const { watch } = form;
  const aliasValue = watch("alias");
  const altEmailValue = watch("altEmail");

  const supabase = createClient<Database>();

  const router = useRouter();

  const [isDisabled, setIsDisabled] = useState(false);

  const checkTicket = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data } = await supabase.from("Guests").select("*");
    if (data) {
      if (data.length !== 0) {
        setData(data);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await checkTicket();
    };

    fetchData();
  }, []);

  return isLoading ? (
    ""
  ) : (
    <Form {...form}>
      <Toaster position="top-right" reverseOrder={false} />
      <form
        onSubmit={form.handleSubmit(async (e) => {
          setLoading(true);
          setIsDisabled(true);
          console.log(e);
          const {
            data: { user },
          } = await supabase.auth.getUser();
          const { data } = await supabase
            .from("Guests")
            .insert({
              alias: e.alias,
              altEmail: e.altEmail,
              isVeg: e.isVeg as unknown as boolean,
              email: user?.email,
            })
            .select("*");

          if (data) {
            setData(data);
          } else {
            toast.error(
              "An error occurred. Please try again or contact administrator."
            );
          }
          setLoading(false);
        })}
        className="space-y-8 ticketForm"
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
          <Image src={logoTall} alt="logo" height="120"/>
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
                Success! Your ticket is generated. You'll be able to see your
                ticket about a week before the event. Till then prepare some
                dance moves to woo your mates on the dance floor!
              </h2>
              <h3>BOOKING ID: {userdata[0].id}</h3>
            </>
          ) : (
            ""
          )
        ) : (
          <>
            <h2 className="text-xl font-semibold">
              Don't miss out on the fun - reserve your spot now!
            </h2>
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <div>
                  <FormItem
                    className={`longInput ${aliasValue ? "has-value" : ""}`}
                  >
                    <FormLabel>Name</FormLabel>
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
                    className={`longInput ${altEmailValue ? "has-value" : ""}`}
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
            <FormField
              control={form.control}
              name="isVeg"
              render={({ field }) => (
                <div>
                  <FormItem className="longInput">
                    {/* <FormLabel>I am a..</FormLabel> */}
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Vegetarian</SelectItem>
                        <SelectItem value="false">Non-Vegetarian</SelectItem>
                      </SelectContent>
                    </Select>
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
          </>
        )}
      </form>
    </Form>
  );
}
