const requestIdPattern = /^[a-zA-Z0-9._:/-]{1,128}$/;

export function getRequestId(request: Request) {
  const candidate = request.headers.get("x-request-id");
  return candidate && requestIdPattern.test(candidate)
    ? candidate
    : crypto.randomUUID();
}

export async function withRequestId(
  request: Request,
  handler: (request: Request) => Promise<Response>,
) {
  const requestId = getRequestId(request);

  try {
    const response = await handler(request);
    const headers = new Headers(response.headers);
    headers.set("x-request-id", requestId);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    logRequestError(error, requestId, new URL(request.url).pathname);
    return Response.json(
      {
        error: { code: "INTERNAL_SERVER_ERROR", message: "Erro interno." },
        requestId,
      },
      { status: 500, headers: { "x-request-id": requestId } },
    );
  }
}

export function logRequestError(
  error: unknown,
  requestId: string,
  path: string,
) {
  const name = error instanceof Error ? error.name : "UnknownError";
  console.error(
    JSON.stringify({
      level: "error",
      event: "request_failed",
      requestId,
      path,
      errorName: name,
    }),
  );
}
