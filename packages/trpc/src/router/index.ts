import { t } from "../trpc";
import { noteRouter } from "./note";

import { notebookRouter } from "./notebook";

export const appRouter = t.router({
  notebook: notebookRouter,
  note: noteRouter,
});

export type AppRouter = typeof appRouter;
