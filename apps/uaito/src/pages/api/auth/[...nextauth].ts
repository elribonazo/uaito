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

const MongooseAdapter: Adapter = {
    async createUser(data) {
        await db.connect();
        const user = await User.create(data);
        return {
            ...user.toObject(),
            id: user._id.toString(),
            emailVerified: user.emailVerified ?? null,
        };
    },
    async getUser(id) {
        await db.connect();
        const user = await User.findById(id).lean().exec();
        if (!user) return null;
        return { ...user, id: user._id.toString(), emailVerified: user.emailVerified ?? null, };
    },
    async getUserByEmail(email) {
        await db.connect();
        const user = await User.findOne({ email }).lean().exec();
        if (!user) return null;
        return { ...user, id: user._id.toString(), emailVerified: user.emailVerified ?? null, };
    },
    async getUserByAccount({ provider, providerAccountId }) {
        await db.connect();
        const account = await Account.findOne({ provider, providerAccountId }).lean().exec();
        if (!account) return null;
        const user = await User.findById(account.userId).lean().exec();
        if (!user) return null;
        return { ...user, id: user._id.toString(), emailVerified: user.emailVerified ?? null, };
    },
    async updateUser(data) {
        await db.connect();
        const { id, ...rest } = data;
        const user = await User.findByIdAndUpdate(id, rest, { new: true, runValidators: true, lean: true }).exec();
        if (!user) {
            throw new Error("User not found during update");
        }
        return { ...user, id: user._id.toString(), emailVerified: user.emailVerified ?? null, };
    },
    async deleteUser(userId) {
        await db.connect();
        await Promise.all([
            User.findByIdAndDelete(userId),
            Account.deleteMany({ userId }),
            Session.deleteMany({ userId }),
        ]);
    },
    async linkAccount(data) {
        await db.connect();
        const account = await Account.create(data);
        return account.toObject();
    },
    async unlinkAccount({ provider, providerAccountId }) {
        await db.connect();
        await Account.findOneAndDelete({ provider, providerAccountId });
    },
    async createSession(data) {
        await db.connect();
        const session = await Session.create(data);
        return session.toObject();
    },
    async getSessionAndUser(sessionToken) {
        await db.connect();
        const session = await Session.findOne({ sessionToken }).lean().exec();
        if (!session) return null;
        const user = await User.findById(session.userId).lean().exec();
        if (!user) return null;
        return {
            session: {
                ...session,
                userId: session.userId.toString(),
                expires: new Date(session.expires.toString()),
            },
            user: { ...user, id: user._id.toString(), emailVerified: user.emailVerified ?? null, },
        };
    },
    async updateSession(data) {
        await db.connect();
        const session = await Session.findOneAndUpdate(
            { sessionToken: data.sessionToken },
            data,
            { new: true, lean: true }
        ).exec();
        if (!session) return null;
        return { ...session, expires: new Date(session.expires.toString()) };
    },
    async deleteSession(sessionToken) {
        await db.connect();
        await Session.findOneAndDelete({ sessionToken });
    },
    async createVerificationToken(data) {
        await db.connect();
        const verificationToken = await VerificationToken.create(data);
        return verificationToken.toObject();
    },
    async useVerificationToken({ identifier, token }) {
        await db.connect();
        const verificationToken = await VerificationToken.findOneAndDelete({
            identifier,
            token,
        }).lean().exec();
        if (!verificationToken) return null;
        return { ...verificationToken, expires: new Date(verificationToken.expires.toString()) };
    },
};

const providers: Provider[] = [];

if (process.env.AUTH_KEYCLOACK_ID && process.env.AUTH_KEYCLOACK_SECRET && process.env.AUTH_KEYCLOACK_ISSUER) {
    providers.push(KeycloakProvider({
        clientId: process.env.AUTH_KEYCLOACK_ID,
        clientSecret: process.env.AUTH_KEYCLOACK_SECRET,
        issuer: process.env.AUTH_KEYCLOACK_ISSUER,
        profile(profile) {
          return {
            id: profile.sub,
            name: profile.name ?? profile.preferred_username,
            email: profile.email,
            image: profile.picture,
            emailVerified: profile.email_verified ? new Date() : null,
          }
        }
    }));
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET || 'vqUHfA39DPNWoBFVGrOtDLdRuCiJYODrYoApKdBWmPU=',
  adapter: MongooseAdapter,
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
    async signIn({ user, account }) {
      if (!user.email || !account) {
        return false;
      }
      await db.connect();
      const existingUser = await User.findOne({ email: user.email });
      if (existingUser) {
        return true;
      }
      // New user, let the adapter handle creation.
      return true;
    },
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