/**
 * @sashite/cell
 *
 * CELL (Coordinate Encoding for Layered Locations) implementation for JavaScript/TypeScript.
 * Implements the CELL Specification v1.0.0.
 *
 * @see https://sashite.dev/specs/cell/1.0.0/
 * @license Apache-2.0
 */

// Constants
export { MAX_DIMENSIONS, MAX_INDEX_VALUE, MAX_STRING_LENGTH } from "./constants.js";

// Errors
export { CellError, ErrorMessages } from "./errors.js";

// Core type
export { Coordinate } from "./coordinate.js";

// Parsing
export { parse, validate, isValid } from "./parser.js";

// Formatting
export { format } from "./formatter.js";
