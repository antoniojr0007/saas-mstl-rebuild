import { prisma } from "@/lib/prisma";
import { getRequestId, logRequestError } from "@/lib/request-id";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestId = getRequestId(request);

  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json(
      { status: "ok", checks: { database: "ok" }, requestId },
      { headers: { "x-request-id": requestId } },
    );
  } catch (error) {
    logRequestError(error, requestId, "/api/health");
    return Response.json(
      { status: "unavailable", checks: { database: "error" }, requestId },
      { status: 503, headers: { "x-request-id": requestId } },
    );
  }
}
