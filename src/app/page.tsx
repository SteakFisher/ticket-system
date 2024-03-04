"use client"
import {createClient} from "@/utils/supabase/client";
import Image from "next/image";

export default function Home() {
  const supabase = createClient();

  return (
      <section className=" min-h-screen flex items-center justify-center bg-gray-200">
        <div className="flex bg-gray-100 ">
            <div className="px-12 py-4 rounded-2xl items-end justify-center text-center shadow-xl">
                <p className=" font-serif text-gray-600 py-8">Sign in for the Events</p>
                <p className=" flex justify-center pb-6 "><Image src={'/calendar.svg'} width={80} height={40}
                                                                 alt={"calendar_icon"}/></p>
                <button className={" py-8"} onClick={async () => {
                  await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                      redirectTo: `${location.origin}/auth/callback/`
                    }
                  })
                }}>
                    <Image src={'/googleSignIn.svg'} width={181} height={40} alt={"Sign in with google"} />
                </button>
            </div>
        </div>
      </section>
  );
}
