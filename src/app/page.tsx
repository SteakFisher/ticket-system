"use client"
import {createClient} from "@/utils/supabase/client";
import {redirect} from "next/navigation";

export default function Home() {
  const supabase = createClient();

  return (
    <button onClick={async ()=> {
       await supabase.auth.signInWithOAuth({
         provider: 'google',
         options: {
           redirectTo: `${location.origin}/auth/callback/`
         }
      })
    }}>
      Sign in with Google
    </button>
  );
}
