import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {

    const { pathname } = req.nextUrl

    // allow landing page separately
    if (pathname === "/" || pathname.startsWith("/auth") || pathname.startsWith("/api") || pathname.startsWith("/verify") || pathname.startsWith("/reset")) {
        return NextResponse.next()
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If no session → redirect to login
    if (!token) {
        const loginUrl = new URL("/auth", req.url)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next();

}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}