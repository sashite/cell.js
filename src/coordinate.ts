import { MAX_DIMENSIONS, MAX_INDEX_VALUE } from "./constants.js";
import { CellError, ErrorMessages } from "./errors.js";

/**
 * Encodes an index (0-255) as lowercase letters (a-z, aa-iv).
 * - 0-25: a-z (single letter)
 * - 26-255: aa-iv (two letters)
 */
function encodeToLower(index: number): string {
  if (index < 26) {
    return String.fromCharCode(97 + index); // 'a' = 97
  }

  const adjusted = index - 26;
  const first = Math.floor(adjusted / 26);
  const second = adjusted % 26;

  return String.fromCharCode(97 + first, 97 + second);
}

/**
 * Encodes an index (0-255) as uppercase letters (A-Z, AA-IV).
 * - 0-25: A-Z (single letter)
 * - 26-255: AA-IV (two letters)
 */
function encodeToUpper(index: number): string {
  if (index < 26) {
    return String.fromCharCode(65 + index); // 'A' = 65
  }

  const adjusted = index - 26;
  const first = Math.floor(adjusted / 26);
  const second = adjusted % 26;

  return String.fromCharCode(65 + first, 65 + second);
}

/**
 * Encodes an index (0-255) as a 1-based positive integer string.
 * - 0 -> "1"
 * - 255 -> "256"
 */
function encodeToNumber(index: number): string {
  return (index + 1).toString();
}

/**
 * Represents a parsed CELL coordinate with up to 3 dimensions.
 * Instances are immutable after construction.
 */
export class Coordinate {
  #indices: readonly number[];

  /**
   * Creates a Coordinate from 1 to 3 indices.
   * @param indices - 0-indexed coordinate values (0-255)
   * @throws {CellError} if no indices provided, more than 3, or values out of range
   */
  constructor(...indices: number[]) {
    if (indices.length === 0) {
      throw new CellError(ErrorMessages.NO_INDICES);
    }

    if (indices.length > MAX_DIMENSIONS) {
      throw new CellError(ErrorMessages.TOO_MANY_DIMENSIONS);
    }

    for (let i = 0; i < indices.length; i++) {
      const index = indices[i]!;

      if (!Number.isInteger(index) || index < 0 || index > MAX_INDEX_VALUE) {
        throw new CellError(ErrorMessages.INDEX_OUT_OF_RANGE);
      }
    }

    this.#indices = Object.freeze([...indices]);
  }

  /**
   * Returns the number of dimensions (1, 2, or 3).
   */
  get dimensions(): number {
    return this.#indices.length;
  }

  /**
   * Returns the coordinate indices as a readonly array.
   */
  get indices(): readonly number[] {
    return this.#indices;
  }

  /**
   * Returns the index at dimension i (0-indexed).
   * @param i - Dimension index
   * @throws {RangeError} if i is out of bounds
   */
  at(i: number): number {
    if (!Number.isInteger(i) || i < 0 || i >= this.#indices.length) {
      throw new RangeError(`Index ${i} out of bounds for ${this.#indices.length} dimensions`);
    }

    return this.#indices[i]!;
  }

  /**
   * Returns the CELL string representation.
   *
   * Encoding follows the CELL spec cyclic pattern:
   * - Dimension 1: lowercase letters (a-z, aa-iv)
   * - Dimension 2: positive integers (1-256)
   * - Dimension 3: uppercase letters (A-Z, AA-IV)
   */
  toString(): string {
    let result = "";

    for (let dim = 0; dim < this.#indices.length; dim++) {
      const index = this.#indices[dim]!;
      const dimensionType = dim % 3;

      switch (dimensionType) {
        case 0:
          // Dimensions 1, 4, 7...: lowercase letters
          result += encodeToLower(index);
          break;
        case 1:
          // Dimensions 2, 5, 8...: positive integers
          result += encodeToNumber(index);
          break;
        case 2:
          // Dimensions 3, 6, 9...: uppercase letters
          result += encodeToUpper(index);
          break;
      }
    }

    return result;
  }
}
