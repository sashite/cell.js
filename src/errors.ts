/**
 * Error thrown when CELL parsing or validation fails.
 * Provides descriptive messages without leaking sensitive information.
 */
export class CellError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CellError";

    // Maintains proper stack trace in V8 environments (Node.js, Chrome)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CellError);
    }
  }
}

/**
 * Error messages for validation failures.
 * Kept as constants to ensure consistency across the library.
 */
export const ErrorMessages = Object.freeze({
  EMPTY_INPUT: "empty input",
  INPUT_TOO_LONG: "input exceeds 7 characters",
  INVALID_START: "must start with lowercase letter",
  UNEXPECTED_CHARACTER: "unexpected character",
  LEADING_ZERO: "leading zero",
  TOO_MANY_DIMENSIONS: "exceeds 3 dimensions",
  INDEX_OUT_OF_RANGE: "index exceeds 255",
  NO_INDICES: "at least one index required",
});
