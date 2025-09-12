import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { findUserByCredentials } from "./lib/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          const user = await findUserByCredentials(
            credentials.username as string,
            credentials.password as string
          );

          if (!user) {
            console.log("User not found or invalid credentials");
            return null;
          }

          console.log("User authorized successfully:", user.username);
          
          // Return the user object with all required properties
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  
  callbacks: {
    async session({ session, token }) {
      // Add custom properties to session
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },

    async jwt({ token, user }) {
      // Add custom properties to token
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
  },
  
  debug: process.env.NODE_ENV === "development",
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});