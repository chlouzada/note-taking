// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter, createContext } from "@note-taking/trpc";
import type { NextApiRequest, NextApiResponse } from "next";

// export API handler
export default (req: NextApiRequest, res: NextApiResponse) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  return createNextApiHandler({
    router: appRouter,
    createContext,
  })(req, res);
};
