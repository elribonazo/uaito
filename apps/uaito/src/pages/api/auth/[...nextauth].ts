import NextAuth from "next-auth"
import type { NextAuthOptions, Session as NextAuthSession, DefaultSession } from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"
import type { Adapter, AdapterAccount, AdapterSession, AdapterUser } from "next-auth/adapters";
import { User, Account, Session, VerificationToken } from "@/db/models";
import { v4 as uuidv4 } from 'uuid';
import type { Provider } from "next-auth/providers/index";
import db from "@/db";

// Get the base URL for NextAuth
if (!process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = process.env.PUBLIC_URL || 'http://localhost:3005'
}

export async function ensureUserExists(user: { name: string; email: string }) {
    const existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
        await User.create({
            name: user.name,
            email: user.email,
        });
    }
}

interface CustomSession extends NextAuthSession {
  user: {
    _id: string;
  } & DefaultSession['user'];
}

const createMongooseAdapter = (): Adapter => {
    const withDbConnection = <T extends (...args: any[]) => Promise<any>>(fn: T) =>
    async (...args: Parameters<T>): Promise<ReturnType<T>> => {
        await db.connect();
        return fn(...args);
    };

    const adapterMethods = {
        createUser: async (data: Omit<AdapterUser, "id">) => {
            const user = await User.create({
                ...data,
            })
            const userObj = user.toObject();
            return {
                ...userObj,
                id: userObj._id.toString(),
            } as AdapterUser
        },
        getUser: async (id) => {
            const user = await User.findById(id).exec()
            if (!user) return null
            const userObj = user.toObject();
            return {
                ...userObj,
                id: userObj._id.toString(),
            } as AdapterUser
        },
        getUserByEmail: async (email) => {
            const user = await User.findOne({ email }).exec()
            if (!user) return null
            const userObj = user.toObject();
            return {
                ...userObj,
                id: userObj._id.toString(),
            } as AdapterUser
        },
        getUserByAccount: async ({ provider, providerAccountId }) => {
            const account = await Account.findOne({ provider, providerAccountId }).exec()
            if (!account) return null
            const user = await User.findById(account.userId).exec()
            if (!user) return null
            const userObj = user.toObject();
            return {
                ...userObj,
                id: userObj._id.toString(),
            } as AdapterUser;
        },
        updateUser: async (data) => {
            const user = await User.findByIdAndUpdate(
                data.id,
                data,
                { new: true }
            ).exec()
            if (!user) throw new Error('User not found')
            const userObj = user.toObject();
            return {
                ...userObj,
                id: userObj._id.toString(),
            } as AdapterUser
        },
        deleteUser: async (userId) => {
            await Promise.all([
                Account.deleteMany({ userId }).exec(),
                Session.deleteMany({ userId }).exec(),
                User.findByIdAndDelete(userId).exec()
            ])
        },
        linkAccount: async (data: AdapterAccount) => {
            await Account.create({
                ...data,
            })
        },
        unlinkAccount: async ({ provider, providerAccountId }) => {
            await Account.findOneAndDelete({ provider, providerAccountId })
        },
        createSession: async (data) => {
            const session = await Session.create({
                ...data,
            })
            return session.toObject() as AdapterSession
        },
        getSessionAndUser: async (sessionToken) => {
            const session = await Session.findOne({ sessionToken }).lean().exec()
            if (!session) return null
            const user = await User.findById(session.userId).lean().exec()
            if (!user) return null
            const userObj = { ...user, id: user._id.toString() } as AdapterUser;
            return {
                session: {
                  ...session,
                  userId: session.userId.toString(),
                  expires: session.expires as Date,
                  sessionToken: session.sessionToken,
                },
                user: userObj
            }
        },
        updateSession: async (data) => {
            const session = await Session.findOneAndUpdate(
                { sessionToken: data.sessionToken },
                data,
                { new: true }
            ).lean().exec()
            if (!session) return null
            return {
                ...session,
                expires: session.expires as Date,
            }
        },
        deleteSession: async (sessionToken) => {
            await Session.findOneAndDelete({ sessionToken }).exec()
        },
        createVerificationToken: async (data) => {
            const verificationToken = await VerificationToken.create({
                ...data,
            })
            return verificationToken.toObject();
        },
        useVerificationToken: async ({ identifier, token }) => {
            const verificationToken = await VerificationToken.findOneAndDelete({
                identifier,
                token
            }).lean().exec()
            if (!verificationToken) return null
            return {
                ...verificationToken,
                expires: verificationToken.expires as Date,
            };
        }
    }
    
    return Object.fromEntries(
        Object.entries(adapterMethods).map(([name, handler]) => [name, withDbConnection(handler)])
    ) as Adapter
}

const providers: Provider[] = [];

if (process.env.AUTH_KEYCLOACK_ID && process.env.AUTH_KEYCLOACK_SECRET && process.env.AUTH_KEYCLOACK_ISSUER) {
    providers.push(KeycloakProvider({
        clientId: process.env.AUTH_KEYCLOACK_ID,
        clientSecret: process.env.AUTH_KEYCLOACK_SECRET,
        issuer: process.env.AUTH_KEYCLOACK_ISSUER,
    }));
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET || 'vqUHfA39DPNWoBFVGrOtDLdRuCiJYODrYoApKdBWmPU=',
  adapter: createMongooseAdapter(),
  useSecureCookies: process.env.NODE_ENV === "production",
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/dashboard',
    error: '/error'
  },
  callbacks: {
      session: async ({ session, user }: { session: NextAuthSession; user: AdapterUser }): Promise<CustomSession> => {
          const customSession: CustomSession = {
              ...session,
              user: {
                  ...session.user,
                  _id: user.id,
              },
          };
          return customSession;
      },
  },
  providers,
}

export default NextAuth(authOptions)