import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

/**
 * Catches any request to a route that does not exist and forwards a
 * consistent 404 through the centralized error handler.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`, "ROUTE_NOT_FOUND"));
}

/**
 * Centralized error handler. Every thrown/forwarded error is normalized
 * into the { error, code, details } response contract required by the
 * assignment, with an appropriate HTTP status code.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      details: err.details,
    });
    return;
  }

  // Unexpected/unhandled error: never leak internals to the client.
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
    details: {},
  });
}
