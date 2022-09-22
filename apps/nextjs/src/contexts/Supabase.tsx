import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase-client";

type SupabaseContext = {
  session: Session | null;
  signIn: ({ email }: { email: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const SupabaseContext = createContext<SupabaseContext>(null!);

export const useSupabase = () => {
  return useContext(SupabaseContext);
};

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);

  const signIn = async ({ email }: { email: string }) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  useEffect(() => {
    let mounted = true;
    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted && session) return setSession(session);
      // document.cookie = "supabase.access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }

    getInitialSession();

    const { data } = supabase.auth.onAuthStateChange((_event, session) =>
      setSession(session)
    );

    return () => {
      mounted = false;
      data.subscription?.unsubscribe();
    };
  }, []);

  const value = {
    session,
    signIn,
    signOut,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}
