// src/pages/_app.tsx
import type { AppType } from "next/dist/shared/lib/utils";
import { trpc } from "../utils/trpc";
import { createEmotionCache, MantineProvider } from "@mantine/core";
import SupabaseProvider from "../contexts/Supabase";
import { themeChange } from "theme-change";

import "../styles/globals.css";
import { useEffect } from "react";

const myCache = createEmotionCache({ key: "mantine" });

const MyApp: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <MantineProvider>
      <SupabaseProvider>
        <Component {...pageProps} />
      </SupabaseProvider>
    </MantineProvider>
  );
};

export default trpc.withTRPC(MyApp);
