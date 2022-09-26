import { t } from "../trpc";
import { editorRouter } from "./editor";

import { noteRouter } from "./note";
import { notebookRouter } from "./notebook";
import { userRouter } from "./user";

export const appRouter = t.router({
  notebook: notebookRouter,
  note: noteRouter,
  user: userRouter,
  editor: editorRouter,
});

export type AppRouter = typeof appRouter;
