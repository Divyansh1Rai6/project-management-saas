
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const backendUrl = process.env.BACKEND_API_URL;

    if (!backendUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Backend URL is not configured",
        },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${backendUrl.replace(/\/+$/, "")}/api/users/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Unable to fetch user profile",
        },
        { status: response.status }
      );
    }

    const user = result.data;

    if (
      !user ||
      typeof user.id !== "string" ||
      typeof user.name !== "string" ||
      typeof user.email !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user profile response",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the backend",
      },
      { status: 503 }
    );
  }
}
