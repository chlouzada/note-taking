import { authedProcedure, t } from "../trpc";
import { z } from "zod";

export const noteRouter = t.router({
  get: authedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.prisma.note.findFirstOrThrow({
      where: {
        id: input,
        userId: ctx.session.id,
      },
    });
  }),
  create: authedProcedure
    .input(z.object({ notebookId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.note.create({
        data: {
          content: "",
          notebook: {
            connect: {
              id: input.notebookId,
            },
          },
          user: {
            connect: {
              id: ctx.session.id,
            },
          },
        },
      });
    }),
  update: authedProcedure
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

      const note = await ctx.prisma.note.findFirstOrThrow({
        where: {
          id,
          userId: ctx.session.id,
        },
      });

      return await ctx.prisma.note.update({
        where: { id: note.id },
        data,
      });
    }),
  delete: authedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    // check if note is owned by user
    const note = await ctx.prisma.note.findFirstOrThrow({
      where: {
        id: input,
        userId: ctx.session.id,
      },
    });

    return await ctx.prisma.note.delete({
      where: { id: note.id },
    });
  }),
});
