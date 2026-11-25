import { NextRequest, NextResponse } from "next/server";
import path from "node:path";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

const ACCESS_TOKEN_MAX_AGE = 15 * 60;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

const PUBLIC_PATHS = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
];

function redirectToLogin(request: NextRequest) {
    const loginUrl = new URL("/login", request.url);

    const response = NextResponse.redirect(loginUrl);

    response.cookies.set("access_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    response.cookies.set("refresh_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    return response;
}

function isPublicPath(pathname: string) {
    return PUBLIC_PATHS.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
    );
}

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    if (!BACKEND_API_URL) {
        return NextResponse.json(
            {
                success: false,
                message: "Backend API URL is not configured.",
            },
            { status: 503 }
        );
    }

    let accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;


    if (!accessToken && !refreshToken) {
        return redirectToLogin(request);
    }

    try {
        if (accessToken) {
            const verifyResponse = await fetch(
                `${BACKEND_API_URL}/api/Users/me`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    cache: "no-store",
                }
            );

            if (verifyResponse.ok) {
                return NextResponse.next();
            }

            if (verifyResponse.status !== 401) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Unable to verify authentication.",

                    },
                    { status: 503 }
                );
            }
        }

        if (!refreshToken) {
            return redirectToLogin(request);
        }

        const refreshResponse = await fetch(`${BACKEND_API_URL}/api/auth/refresh`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({refreshToken}),
                cache: "no-store",
            }
        );

        if (!refreshResponse.ok) {
            if (refreshResponse.status >= 500) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Authentication service is temporarily unavailable.",
                    },
                    { status: 503 }
                );
            }
            return redirectToLogin(request);
        }

         const refreshResult = await refreshResponse.json();

    const newAccessToken = refreshResult?.data?.token;
    const newRefreshToken = refreshResult?.data?.refreshToken;

    if (
      typeof newAccessToken !== "string" ||
      !newAccessToken ||
      typeof newRefreshToken !== "string" ||
      !newRefreshToken
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid authentication response.",
        },
        { status: 503 }
      );
    }

    // Verify the newly issued access token.
    const retryResponse = await fetch(
      `${BACKEND_API_URL}/api/users/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!retryResponse.ok) {
      if (retryResponse.status === 401) {
        return redirectToLogin(request);
      }

      return NextResponse.json(
        {
          success: false,
          message: "Unable to verify refreshed authentication.",
        },
        { status: 503 }
      );
    }

    // Continue the request and save rotated tokens.
    const response = NextResponse.next();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    response.cookies.set("access_token", newAccessToken, {
      ...cookieOptions,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    response.cookies.set("refresh_token", newRefreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return response;
  } catch {
    // Do not destroy a potentially valid session
    // when the backend is temporarily unreachable.
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the authentication service.",
      },
      { status: 503 }
    );
    }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};