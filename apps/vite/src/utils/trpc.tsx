import { createTRPCReact, httpBatchLink } from "@trpc/react";
import type { AppRouter } from "@note-taking/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (import.meta.env.VITE_ENV === "development")
    return "http://localhost:4321/api/trpc";
  else return import.meta.env.VITE_NEXTJS_URL + "/api/trpc";
};

export const TRPCProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getBaseUrl(),
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "omit",
            });
          },
          // // optional
          // headers() {
          //   return {
          //     authorization: getAuthCookie(),
          //   };
          // },
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
