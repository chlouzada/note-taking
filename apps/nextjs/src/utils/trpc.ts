// src/utils/trpc.ts
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "@note-taking/trpc";
import { clientEnv } from "../env/schema.mjs";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

const getAuthorization = () => {
  if (typeof window === "undefined") return "";

  const cookie = document.cookie
    .split(";")
    .find((c) =>
      c
        .trim()
        .startsWith(`sb-${clientEnv.NEXT_PUBLIC_SUPABASE_REF}-access-token`)
    );

  const value = cookie?.split("=")[1];

  return value ?? "";
};

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "omit",
            });
          },
          headers() {
            return {
              authorization: getAuthorization(),
            };
          },
        }),
      ],
    };
  },
  ssr: false,
});
