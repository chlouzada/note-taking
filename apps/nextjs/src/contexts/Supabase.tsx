import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/router.js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { clientEnv } from "../env/schema.mjs";
import { supabase } from "../utils/supabase-client";
import { trpc } from "../utils/trpc";

type SupabaseContext = {
  session: Session | null;
  signIn: ({ email }: { email: string }) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

const SupabaseContext = createContext<SupabaseContext>(null!);

export const useSupabase = () => {
  return useContext(SupabaseContext);
};

const syncWithCookies = (session: Session | null) => {
  const name = `sb-${clientEnv.NEXT_PUBLIC_SUPABASE_REF}-access-token`;
  if (session) {
    document.cookie = `${name}=${session.access_token}; path=/;`;
  } else {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  }
};

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, _setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const userCreate = trpc.user.create.useMutation();

  const setSession = (session: Session | null) => {
    syncWithCookies(session);
    _setSession(session);
  };

  const signIn = async ({ email }: { email: string }) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push("/");
  };

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted && session) {
        setSession(session);
      }
      setIsLoading(false);
    }

    getInitialSession();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (event == "SIGNED_IN" && session)
        userCreate.mutate({
          jwt: session.access_token,
        });
    });

    return () => {
      mounted = false;
      data.subscription?.unsubscribe();
    };
  }, []);

  const value = {
    session,
    signOut,
    signIn,
    signInWithGoogle,
    isLoading,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}
