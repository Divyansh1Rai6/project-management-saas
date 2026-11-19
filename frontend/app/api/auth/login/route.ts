import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const origin = request.headers.get("origin");

        if (origin && origin !== request.nextUrl.origin) {
            return NextResponse.json(
                { success: false, message: "Invalid request origin"},
                { status: 403 },
            );
        }

        const body = await request.json();
        const { email, password } = body;

        if (
            typeof email !== "string" || typeof password !== "string" || !email.trim() || !password || Buffer.byteLength(password, "utf8") > 72
        ) {
            return NextResponse.json(
                { success: false, message: "please provide a valid email and password"},
                { status: 400 },
            );
        }
        const backendUrl = process.env.BACKEND_API_URL;

        if (!backendUrl) {
            return NextResponse.json(
                { success: false, message: "Backend url is not configured"},
                { status: 500 },
            );
        }

        const response = await fetch(
            `${backendUrl.replace(/\/+$/, "")}/api/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                }),
                cache: "no-store",
            },
        );
        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: result.message || "Login failed",
                },
                { status: response.status },
            );
        }

        const { token, refreshToken, user } = result.data || {};

        if (!token || !refreshToken || !user) {
            return NextResponse.json(
                { success: false, message: "Invalid backend response"},
                { status: 502 },
            );
        }

        const secure = process.env.NODE_ENV === "production";

        const nextResponse = NextResponse.json({
            success: true,
            message: result.message || "Login successful",
            user,
        });

        nextResponse.cookies.set("access_token", token, {
            httpOnly: true,
            secure,
            sameSite: "lax",
            path: "/",
            maxAge: 15 * 60,
        });

        nextResponse.cookies.set("refresh_token", refreshToken, {
            httpOnly: true,
            secure,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        return nextResponse;
    }   catch {
        return NextResponse.json(
            { success: false, message: "Unable to process login request"},
            { status: 500 },
        );
    }
}
