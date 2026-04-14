import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export const proxy = auth(function proxy(req) {
  const isLoggedIn = !!req.auth

  const protectedPaths = ["/dashboard", "/profile"]
  const isProtected = protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p))

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
}
