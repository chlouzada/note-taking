import { z } from "zod";
import { authedProcedure, t } from "../trpc";

export const notebookRouter = t.router({
  all: authedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.notebook.findMany({
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
          },
        },
      },
    });
  }),

  create: authedProcedure
    .input(z.object({ title: z.string(), description: z.string().nullish() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.notebook.create({
        data: {
          ...input,
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
          description: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;

      const notebook = await ctx.prisma.notebook.findFirstOrThrow({
        where: { id },
      });

      return ctx.prisma.notebook.update({
        where: { id: notebook.id },
        data,
      });
    }),
});
