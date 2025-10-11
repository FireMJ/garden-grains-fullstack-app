import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// 🔒 Ensure NEXTAUTH_SECRET is defined
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("❌ NEXTAUTH_SECRET is not set in .env");
}

// 🧩 Extend NextAuth types for session & JWT
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      isNewUser?: boolean;
    };
  }

  interface JWT {
    id: string;
    role: string;
    isNewUser?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email / Username / Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.identifier || !credentials.password)
          throw new Error("Please provide your login details.");

        const { identifier, password } = credentials;

        // 🔍 Match by email, phone, or name
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { phone: identifier },
              { name: identifier },
            ],
          },
        });

        if (!user) throw new Error("No user found with that login detail.");

        // 🔑 Verify password
        const hashedPassword = (user as any).hashedPassword ?? user.password;
        if (!hashedPassword) throw new Error("Invalid credentials.");

        const isValid = await bcrypt.compare(password, hashedPassword);
        if (!isValid) throw new Error("Invalid password.");

        // ✅ Return safe user object
        return {
          id: user.id,
          name: user.name ?? "Unnamed User",
          email: user.email,
          role: user.role ?? "USER",
          isNewUser: user.isNewUser ?? false,
        };
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isNewUser = user.isNewUser;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isNewUser = token.isNewUser as boolean;
      }
      return session;
    },
  },
};
