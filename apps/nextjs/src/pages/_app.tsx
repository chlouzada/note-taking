// src/pages/_app.tsx
import type { AppType } from "next/dist/shared/lib/utils";
import { trpc } from "../utils/trpc";
import { createEmotionCache, MantineProvider } from "@mantine/core";
import SupabaseProvider from "../contexts/Supabase";

import "../styles/globals.css";

const myCache = createEmotionCache({ key: "mantine" });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MantineProvider emotionCache={myCache} withGlobalStyles withNormalizeCSS>
      <SupabaseProvider>
        <Component {...pageProps} />
      </SupabaseProvider>
    </MantineProvider>
  );
};

export default trpc.withTRPC(MyApp);
