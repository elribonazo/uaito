import { getServerSession } from "next-auth";

import { IUser, UserModel } from "@/db/models/User";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getSessionUser(req, res): Promise<IUser | null> {
    const session = await getServerSession(req, res, authOptions);
    if ((!session || !session.user) && !req.headers['token']) {
      return null
    }
    if (session && session.user && session.user.email) {
      return UserModel.findOne({
        email: session.user.email
      })
    }
    const apiKey = req.headers['token'];
    if (apiKey) {
      return UserModel.findOne({
        apiKey: apiKey
      })
    }
    return null
  }