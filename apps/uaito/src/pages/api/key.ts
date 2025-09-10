import type { NextApiRequest, NextApiResponse } from 'next';
import { AbortController } from 'abort-controller';
import NextCors from 'nextjs-cors';
import { getServerSession } from "next-auth/next"
import {authOptions} from "./auth/[...nextauth]"
import { getApiKey } from "@/db/models/User"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    origin: '*',
    optionsSuccessStatus: 200,
  });


  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }
  const session = await getServerSession(req, res, authOptions);

  if ((!session || !session.user) && req.headers['token'] !== 'elribonazo') {
    return res.status(403).end('Not Allowed');
  }

  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Transfer-Encoding': 'chunked',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
  });

  const abortController = new AbortController();

  res.on('close', () => {
    abortController.abort();
    console.log('Client disconnected, aborting stream');
  });

  try {
    const email = session?.user?.email ?? '';
    const apiKey = await getApiKey(email)
    res.json({apiKey})
} catch (error) {
    console.error("Error:", error);
    res.json({message:  (error as Error).message})
  }

}