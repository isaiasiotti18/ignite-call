import { PrismaAdapter } from "@/lib/auth/prisma-adapter";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

export function buildNextAuthOptions(
  req?: NextApiRequest,
  res?: NextApiResponse
): NextAuthOptions {
  return {
    secret: process.env.NEXTAUTH_SECRET ?? "",
    adapter: PrismaAdapter(),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
            scope:
              "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar",
          },
        },
        profile(profile: GoogleProfile) {
          return {
            id: profile.sub,
            name: profile.name,
            username: "",
            email: profile.email,
            avatar_url: profile.picture,
          };
        },
      }),
    ],

    callbacks: {
      async signIn({ account }) {
        if (
          !account?.scope?.includes("https://www.googleapis.com/auth/calendar")
        ) {
          return "/register/connect-calendar/?error=permissions";
        }

        return true;
      },

      async session({ user, session }) {
        return {
          ...session,
          user,
        };
      },
    },
  };
}

// ============================================================
// ✅ Apenas exports nomeados — sem export default
// ✅ Mantém acesso ao req e res
// ============================================================

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await NextAuth(req, res, buildNextAuthOptions(req, res));
};

export const GET = handler;
export const POST = handler;
