// src/server/router/index.ts
import { t } from "../trpc";
import { notebookRouter } from "./notebook";


export const appRouter = t.router({
  notebook: notebookRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
