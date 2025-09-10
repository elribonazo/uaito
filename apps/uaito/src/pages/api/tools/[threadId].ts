
import db from '@/db';
import { ToolModel } from '@/db/models/Tool';
import { getSessionUser } from '@/utils/getSessionUser';
import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    origin: '*',
    optionsSuccessStatus: 200,
  });
  if (req.method !== 'POST' && req.method !== "GET") {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  await db.connect()
  const currentUser = await getSessionUser(req, res)
  if (!currentUser) {
    return res.status(403).end('Invalid session or auth token');
  }
  const {threadId} = req.query;
  if (!threadId) {
    throw new Error('No threadId provided');
  }
  if (req.method === "GET") {
    const tools = await ToolModel.find({
      threadId: threadId,
      userId: currentUser.id,
      state: {
        $ne: 'completed'
      },
    });
    return res.status(200).json(tools)
  } 
  const rawBody = req.body;
  const { result,content, isError } = typeof req.body === "string" ? JSON.parse(rawBody): rawBody;
  if (!result && !content) {
    throw new Error('content json is required')
  }
  const tool = await ToolModel.findOne({
    threadId: threadId,
    userId: currentUser.id,
    state: {
      $ne: 'completed'
    }
  });
  if (tool) {
    tool.content = JSON.stringify(content || result);
    tool.state = "completed";
    tool.error = isError && isError === true ? true: false
    await tool.save()
  }
  return res.status(200).json({
    success: true
  })
}