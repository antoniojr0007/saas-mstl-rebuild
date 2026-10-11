import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { withRequestId } from "@/lib/request-id";

const handlers = toNextJsHandler(auth);

export const runtime = "nodejs";
export const GET = (request: Request) => withRequestId(request, handlers.GET);
export const POST = (request: Request) => withRequestId(request, handlers.POST);
