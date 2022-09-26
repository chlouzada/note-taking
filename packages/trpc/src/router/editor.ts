import { authedProcedure, t } from "../trpc";
import { z } from "zod";

export const editorRouter = authedProcedure.query(async ({ ctx }) => {
  const all = await ctx.prisma.notebook.findMany({
    where: {
      userId: ctx.session.id,
    },
    include: {
      notes: {
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          notebookId: true,
          content: true,
        },
      },
    },
  });

  return all.map((notebook) => ({
    ...notebook,
    notes: notebook.notes.map((note) => ({
      ...note,
      content:
        note.content.length > 30
          ? note.content.slice(0, 30) + "..."
          : note.content,
    })),
  }));
});