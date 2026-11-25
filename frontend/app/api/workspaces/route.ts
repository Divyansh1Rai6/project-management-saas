
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch all workspaces
export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const backendUrl = process.env.BACKEND_API_URL;

    if (!backendUrl) {
      return NextResponse.json(
        { success: false, message: "Backend URL is not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(
      `${backendUrl.replace(/\/+$/, "")}/api/workspaces`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Unable to fetch workspaces",
        },
        { status: response.status },
      );
    }

    if (!Array.isArray(result.data)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid workspaces response from backend",
        },
        { status: 502 },
      );
    }

    const workspaces = result.data.map((workspace: {
      _id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    }) => ({
      id: workspace._id,
      name: workspace.name,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      count: workspaces.length,
      data: workspaces,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the backend",
      },
      { status: 503 },
    );
  }
}

// POST: Create a new workspace
export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");

    if (origin !== request.nextUrl.origin) {
      return NextResponse.json(
        { success: false, message: "Invalid request origin" },
        { status: 403 },
      );
    }

    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const backendUrl = process.env.BACKEND_API_URL;

    if (!backendUrl) {
      return NextResponse.json(
        { success: false, message: "Backend URL is not configured" },
        { status: 500 },
      );
    }

    const body = await request.json();

    if (
      typeof body.name !== "string" ||
      body.name.trim().length < 2 ||
      body.name.trim().length > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Workspace name must be between 2 and 100 characters",
        },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${backendUrl.replace(/\/+$/, "")}/api/workspaces`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: body.name.trim(),
        }),
        cache: "no-store",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Unable to create workspace",
        },
        { status: response.status },
      );
    }

    const workspace = result.data;

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        data: {
          id: workspace._id,
          name: workspace.name,
          createdAt: workspace.createdAt,
          updatedAt: workspace.updatedAt,
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to process workspace request",
      },
      { status: 400 },
    );
  }
}
