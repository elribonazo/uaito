import db from "@/db"
import { createUser, findUserByEmail } from "@/db/models/User"
import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export async function ensureUserExists({email, name}:{name: string, email:string}) {
  await db.connect();
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return existingUser;
  }
  if (process.env.ENABLE_BETA === undefined && process.env.NODE_ENV === 'production') {
    throw new Error("Beta access is now closed, sorry!")
  }
  return createUser(name, email)
}

export const authOptions: NextAuthOptions = {
  secret: 'vqUHfA39DPNWoBFVGrOtDLdRuCiJYODrYoApKdBWmPU=',
  useSecureCookies: process.env.NODE_ENV === "production",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    error: '/error'
  },
  callbacks: {
    async session({ session }) {
      if (session) {
        if (session.user && session.user.email && session.user.name) {
          await ensureUserExists({
            email: session.user.email,
            name: session.user.name
          })
        }
      }
      return session
    },
    async signIn({ user }) {
      if (!user.email) {
        throw new Error("Invalid email address");
      }
      if (!user.name) {
        throw new Error("Invalid email address");
      }
      await ensureUserExists({
        email: user.email,
        name: user.name
      })
      return true
    }
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GCLIENT_ID!,
      clientSecret: process.env.GCLIENT_SECRET!,
    }),
  ],
}

export default NextAuth(authOptions)