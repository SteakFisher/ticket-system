"use client"

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {createClient} from "@/utils/supabase/client";
import {Database} from "../../database.types";

const formSchema = z.object({
  alias: z.string()
    .min(2, {
      message: "Alias must be at least 2 characters.",
    })
    .max(12, {
      message: "Alias must be at most 12 characters.",
    })
    .regex(new RegExp("^\\w+$")),
  altEmail: z.string().email({ message: "Invalid email address" }),
  isVeg: z.string()
})

export default function FormElement() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      alias: "",
      altEmail: "",
      isVeg: "true",
    },
  })

  const supabase = createClient<Database>()

  const router = useRouter()

  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(async (e) => {
        setIsDisabled(true);
        console.log(e)
        const { data: { user }} = await supabase.auth.getUser()
        console.log(user)
        await supabase.from("Guests").insert({alias: e.alias, altEmail: e.altEmail, isVeg: e.isVeg as unknown as boolean, email: user?.email})
        router.push("/form/success")

      })} className="space-y-8">
        <FormField
          control={form.control}
          name="alias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alias</FormLabel>
              <FormControl>
                <Input placeholder="SteakFisher" {...field} />
              </FormControl>
              <FormDescription>
                Display name for the event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="altEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alternate Email</FormLabel>
              <FormControl>
                <Input type={"email"} placeholder="kermitthefrog@gmail.com" {...field} />
              </FormControl>
              <FormDescription>
                Alternate email for PLAUSIBLE notifications (and to sell your data).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isVeg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>I am a..</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Vegetarian" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Vegetarian</SelectItem>
                  <SelectItem value="false">Non-Vegetarian</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                We (sometimes) care about your opinion.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isDisabled}>Submit</Button>
      </form>
    </Form>
  )
}