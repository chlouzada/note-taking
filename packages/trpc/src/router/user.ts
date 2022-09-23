import { authedProcedure, t } from "../trpc";
import { z } from "zod";
import { JwtPayload, verify } from "jsonwebtoken";
import { SupabaseJwtPayload } from "../context";

export const userRouter = t.router({
  create: t.procedure
    .input(
      z.object({ /* id: z.string(), email: z.string(),*/ jwt: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: better way to check if user is logged in
      const payload = verify(
        input.jwt,
        process.env.JWT_SECRET!
      ) as SupabaseJwtPayload;

      const user = await ctx.prisma.user.findFirst({
        where: {
          id: payload.sub,
        },
      });

      if (user) return user;

      await ctx.prisma.user.create({
        data: {
          id: payload.sub,
          email: payload.email,
        },
      });

      const notebook = await ctx.prisma.notebook.create({
        data: {
          title: "My First Notebook",
          user: {
            connect: {
              id: payload.sub,
            },
          },
        },
      });

      ctx.prisma.note.create({
        data: {
          title: "Welcome to Note Taking!",
          content:
            "This is your first note. You can edit it by clicking on it.",
          notebook: {
            connect: {
              id: notebook.id,
            },
          },
          user: {
            connect: {
              id: payload.sub,
            },
          },
        },
      });
    }),
});
