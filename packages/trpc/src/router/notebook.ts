import { t } from "../trpc";
import { z } from "zod";

const notebooks = [
  {
    id: "1",
    title: "Hackernews",
    description: "Hackernews clone",
  },
  {
    id: "2",
    title: "Todo",
    description: "Todo app",
  },
];

export const notebookRouter = t.router({
  list: t.procedure.query(async () => {
    return notebooks;
  }),
});
