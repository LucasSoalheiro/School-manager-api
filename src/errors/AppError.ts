/**
 * Base class for all application-specific errors.
 * Allows the global error handler to map each error to the correct HTTP status
 * without relying on fragile string matching.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "AppError";
  }
}

/** 400 Bad Request — invalid input, business rule violation */
export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = "BadRequestError";
  }
}

/** 401 Unauthorized — authentication required */
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

/** 403 Forbidden — authenticated but not allowed */
export class ForbiddenError extends AppError {
  constructor(message: string = "Access denied") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

/** 404 Not Found */
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    this.name = "NotFoundError";
  }
}
