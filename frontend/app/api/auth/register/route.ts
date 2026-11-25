import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
    try {
        const origin = request.headers.get("origin");

        if (origin && origin !== request.nextUrl.origin) {
            return NextResponse.json(
                { success: false, message: "Invalid request origin"},
                { status: 403 }
            );
        }

        let body: unknown;

        try {
            body = await request.json();
        }   catch {
            return NextResponse.json(
                { success: false, message: "Invalid request body"},
                { status: 400 }
            );
        }

        if ( typeof body !== "object" || body === null || Array.isArray(body)
        ) {
            return NextResponse.json(
                { success: false, message: "Invalid request body" },
                { status: 400 }
            );
        }   

        const { name, email, password } = body as Record<string, unknown>;

        if ( typeof name !== "string" || typeof email !== "string" || typeof password !== "string" || !name.trim() || !email.trim() || !password || Buffer.byteLength(password, "utf8") > 72)  {
            return NextResponse.json(
                { success: false, message: "please provide a valid name, email and password"},
                { status: 400 }
            );
        }
        const backendUrl = process.env.BACKEND_API_URL;

        if (!backendUrl) {
            return NextResponse.json(
                { success: false, message: "Backend URL is not configured" },
                { status: 500 }
            );
        }

        const response = await fetch(`${backendUrl.replace(/\/+$/, "")}/api/auth/register`,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password
        }),
        cache: "no-store"
    }
);

    const result = await response.json();

    if (!response.ok) {
        return NextResponse.json(
            {
                success: false,
                message: result.message || "Registeration failed"
            },
            { status: response.status }
        );
    }
    const user = result.data;

    if (!user || typeof user.id !== "string" || typeof user.name !== "string" || typeof user.email !== "string") {
        return NextResponse.json(
            { success: false, message: "Invalid backend response" },
            { status: 502 }
        );
    }

    return NextResponse.json(
        {
            success: true,
            message: result.message || "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        },
        { status: 201 }
    );
    }   catch {
        return NextResponse.json(
            {
                success: false,
                message: "Unable to process registeration request"
            },
            { status: 500 }
        );
    }
}