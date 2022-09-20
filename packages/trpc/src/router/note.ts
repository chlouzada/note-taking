import { t } from "../trpc";
import { z } from "zod";

export const noteRouter = t.router({
  get: t.procedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.prisma.note.findUnique({
      where: {
        id: input,
      },
    });
  }),
  create: t.procedure
    .input(z.object({ title: z.string(), notebookId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.note.create({
        data: {
          title: input.title,
          content: "",
          notebook: {
            connect: {
              id: input.notebookId,
            },
          },
        },
      });
    }),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          title: z.string().optional(),
          content: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const note = await ctx.prisma.note.update({
        where: { id },
        data,
      });
      return note;
    }),
});
