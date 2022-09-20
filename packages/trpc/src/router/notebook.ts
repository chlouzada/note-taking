import { z } from "zod";
import { t } from "../trpc";

export const notebookRouter = t.router({
  all: t.procedure.query(async ({ ctx }) => {
    const notebooks = await ctx.prisma.notebook.findMany({
      include: {
        notes: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
            notebookId: true,
          },
        },
      },
    });

    if (notebooks.length === 0) {
      const notebook = await ctx.prisma.notebook.create({
        data: {
          title: "Default",
        },
      });

      const note = await ctx.prisma.note.create({
        data: {
          title: "Welcome to Note Taking!",
          content:
            "This is your first note. You can edit it by clicking on it.",
          notebook: {
            connect: {
              id: notebook.id,
            },
          },
        },
      });

      throw new Error("retry");
    }

    return notebooks;
  }),

  create: t.procedure
    .input(z.object({ title: z.string(), description: z.string().nullish() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.notebook.create({
        data: input,
      });
    }),

  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const notebook = await ctx.prisma.notebook.update({
        where: { id },
        data,
      });
      return notebook;
    }),
});
