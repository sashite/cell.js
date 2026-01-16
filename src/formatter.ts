import { Coordinate } from "./coordinate.js";

/**
 * Formats indices into a CELL string.
 *
 * Convenience function equivalent to `new Coordinate(...indices).toString()`.
 *
 * @param indices - 0-indexed coordinate values (0-255)
 * @returns CELL string
 * @throws {CellError} if indices are invalid (none provided, more than 3, or out of range)
 *
 * @example
 * format(4, 3)    // "e4"
 * format(0, 0, 0) // "a1A"
 * format(2, 2, 2) // "c3C"
 */
export function format(...indices: number[]): string {
  return new Coordinate(...indices).toString();
}
