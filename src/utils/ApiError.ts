/**
 * Application-wide error type used by the centralized error handler to
 * produce the consistent { error, code, details } JSON response shape
 * required across all API endpoints.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: Record<string, unknown>;

  constructor(statusCode: number, code: string, message: string, details: Record<string, unknown> = {}) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, code = "BAD_REQUEST", details: Record<string, unknown> = {}): ApiError {
    return new ApiError(400, code, message, details);
  }

  static unauthorized(message: string, code = "UNAUTHORIZED", details: Record<string, unknown> = {}): ApiError {
    return new ApiError(401, code, message, details);
  }

  static forbidden(message: string, code = "FORBIDDEN", details: Record<string, unknown> = {}): ApiError {
    return new ApiError(403, code, message, details);
  }

  static notFound(message: string, code = "NOT_FOUND", details: Record<string, unknown> = {}): ApiError {
    return new ApiError(404, code, message, details);
  }

  static conflict(message: string, code = "CONFLICT", details: Record<string, unknown> = {}): ApiError {
    return new ApiError(409, code, message, details);
  }

  static tooManyRequests(message: string, code = "TOO_MANY_REQUESTS", details: Record<string, unknown> = {}): ApiError {
    return new ApiError(429, code, message, details);
  }

  static internal(message: string, code = "INTERNAL_SERVER_ERROR", details: Record<string, unknown> = {}): ApiError {
    return new ApiError(500, code, message, details);
  }
}
