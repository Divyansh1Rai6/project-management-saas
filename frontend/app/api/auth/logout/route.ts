import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

function clearAuthCookies(response: NextResponse) {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 0,
    };

    response.cookies.set("access_token", "", cookieOptions);
    response.cookies.set("refresh_token", "", cookieOptions);
}

export async function POST(request: NextRequest) {
    const origin = request.headers.get("origin");

    if (origin && origin !== request.nextUrl.origin) {
        return NextResponse.json(
            {
                success: false,
                message: "Invalid request origin",
            },
            { status: 403 }
        );
    }

    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (BACKEND_API_URL && accessToken && refreshToken) {
        try {
            await fetch(`${BACKEND_API_URL}/api/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ refreshToken }),
                cache: "no-store",
            });
        }   catch {
            // Browser cookies will still be cleared.
        }
    }

    const response = NextResponse.json({
        success: true,
        message: "Logged out successfully.",
    });

    clearAuthCookies(response);
    return response;
}   