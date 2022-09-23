// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { prisma } from "@note-taking/db";
import { JwtPayload, verify } from "jsonwebtoken";

export type SupabaseJwtPayload = JwtPayload & {
  email: string;
  sub: string;
};

type Session = {
  id: string;
  email: string;
};

type CreateContextOptions = {
  session: Session | null;
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 */
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  const { req } = opts;

  const jwt = req.headers.authorization;

  const payload = jwt
    ? (verify(jwt, process.env.JWT_SECRET!) as SupabaseJwtPayload)
    : null;

  const session = payload
    ? {
        id: payload.sub,
        email: payload.email,
      }
    : null;

  return await createContextInner({ session });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
