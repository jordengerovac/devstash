import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import authConfig from "./auth.config"

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  // Spread authConfig for pages, callbacks, etc. — but override providers
  // to avoid duplicating the placeholder Credentials from auth.config.ts.
  ...authConfig,
  providers: [
    GitHub,
    Credentials({
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email?: string
          password?: string
        }

        if (!email || !password) return null

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user?.password) return null

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return null

        return { id: user.id, name: user.name, email: user.email, image: user.image }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // OAuth providers (e.g. GitHub) skip email verification
      if (account?.provider !== "credentials") return true

      // Skip verification check when EMAIL_VERIFICATION_ENABLED=false
      if (process.env.EMAIL_VERIFICATION_ENABLED === "false") return true

      // Block unverified credentials users
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id! },
        select: { emailVerified: true },
      })

      if (!dbUser?.emailVerified) return "/verify-email?error=unverified"
      return true
    },
  },
})
