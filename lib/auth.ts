// lib/auth.ts

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  callbacks: {
    async jwt({ token, account }) {
      // 登录时，把access_token存在token里
      if (account) {
        console.log("jwt callback:", { token, account });

        token.accessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }: any) {
      // 把token里的accessToken传给session
      console.log("session callback:", { session, token });

      session.accessToken = token.accessToken;

      return session;
    },
  },
};
