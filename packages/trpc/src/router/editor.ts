import { authedProcedure } from "../trpc";

export const editorRouter = authedProcedure.query(async ({ ctx }) => {
  const notebooks = await ctx.prisma.notebook.findMany({
    where: {
      userId: ctx.session.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const notes = await ctx.prisma.note.findMany({
    where: {
      userId: ctx.session.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return {
    notebooks,
    notes: notes.map((note) => ({
      ...note,
      content:
        note.content.length > 30
          ? note.content.slice(0, 30) + "..."
          : note.content,
    })),
  };
});
