import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes
} from "@/routes"
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth

  const isApiAuthRote = nextUrl.pathname.startsWith(apiAuthPrefix)

  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);


  if (isApiAuthRote) {
    return null
  }

  if (isAuthRoute) {
    if(isLoggedIn){
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null;
  }

  if(!isLoggedIn && !isPublicRoutes){
    return NextResponse.rewrite(new URL("/auth/login", nextUrl))
  }

  return null;
})

export const config = {
  matcher:[
    // "/auth/login",
    // "/auth/register",
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/(api|trpc)(.*)",
    "/",
  ]
}