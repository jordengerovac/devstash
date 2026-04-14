import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

export default {
  providers: [
    GitHub,
    Credentials({
      // bcrypt can't run in Edge runtime (used by middleware/proxy),
      // so we put the real authorize logic in auth.ts and use a
      // placeholder here for the split-config pattern.
      authorize: () => null,
    }),
  ],
} satisfies NextAuthConfig
