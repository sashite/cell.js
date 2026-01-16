import { MAX_DIMENSIONS, MAX_INDEX_VALUE, MAX_STRING_LENGTH } from "./constants.js";
import { CellError, ErrorMessages } from "./errors.js";
import { Coordinate } from "./coordinate.js";

/**
 * Character classification helpers.
 * Using charCodeAt for performance and to avoid locale-dependent behavior.
 */
function isLowercase(charCode: number): boolean {
  return charCode >= 97 && charCode <= 122; // 'a' = 97, 'z' = 122
}

function isUppercase(charCode: number): boolean {
  return charCode >= 65 && charCode <= 90; // 'A' = 65, 'Z' = 90
}

function isDigit(charCode: number): boolean {
  return charCode >= 48 && charCode <= 57; // '0' = 48, '9' = 57
}

/**
 * Dimension types in the CELL cyclic pattern.
 */
const enum DimensionType {
  Lowercase = 0, // n % 3 = 1 → index 0
  Integer = 1,   // n % 3 = 2 → index 1
  Uppercase = 2, // n % 3 = 0 → index 2
}

/**
 * Internal parsing result containing the decoded indices.
 */
interface ParseResult {
  indices: number[];
}

/**
 * Decodes a sequence of lowercase letters to an index (0-255).
 * - Single letter: a=0, b=1, ..., z=25
 * - Two letters: aa=26, ab=27, ..., iv=255
 */
function decodeLowercase(chars: number[]): number {
  if (chars.length === 1) {
    return chars[0]! - 97; // 'a' = 97
  }

  // Two letters: 26 + (first * 26) + second
  const first = chars[0]! - 97;
  const second = chars[1]! - 97;

  return 26 + first * 26 + second;
}

/**
 * Decodes a sequence of uppercase letters to an index (0-255).
 * - Single letter: A=0, B=1, ..., Z=25
 * - Two letters: AA=26, AB=27, ..., IV=255
 */
function decodeUppercase(chars: number[]): number {
  if (chars.length === 1) {
    return chars[0]! - 65; // 'A' = 65
  }

  // Two letters: 26 + (first * 26) + second
  const first = chars[0]! - 65;
  const second = chars[1]! - 65;

  return 26 + first * 26 + second;
}

/**
 * Decodes a sequence of digits to an index (0-255).
 * Input is 1-based (1-256), output is 0-based (0-255).
 */
function decodeInteger(chars: number[]): number {
  let value = 0;

  for (let i = 0; i < chars.length; i++) {
    value = value * 10 + (chars[i]! - 48); // '0' = 48
  }

  // Convert from 1-based to 0-based
  return value - 1;
}

/**
 * Parses a CELL string into a Coordinate.
 *
 * Security considerations:
 * - Character-by-character parsing (no regex, no ReDoS risk)
 * - Fail-fast on invalid input
 * - Bounded iteration (max 7 characters)
 *
 * @param s - CELL coordinate string
 * @returns Coordinate
 * @throws {CellError} if the string is not valid
 */
export function parse(s: string): Coordinate {
  // Fail-fast: check length constraints first
  if (s.length === 0) {
    throw new CellError(ErrorMessages.EMPTY_INPUT);
  }

  if (s.length > MAX_STRING_LENGTH) {
    throw new CellError(ErrorMessages.INPUT_TOO_LONG);
  }

  // Check first character must be lowercase
  const firstCharCode = s.charCodeAt(0);
  if (!isLowercase(firstCharCode)) {
    throw new CellError(ErrorMessages.INVALID_START);
  }

  const result: ParseResult = { indices: [] };
  let pos = 0;
  let expectedType: DimensionType = DimensionType.Lowercase;

  while (pos < s.length) {
    // Check dimension limit before parsing next dimension
    if (result.indices.length >= MAX_DIMENSIONS) {
      throw new CellError(ErrorMessages.TOO_MANY_DIMENSIONS);
    }

    const charCode = s.charCodeAt(pos);

    switch (expectedType) {
      case DimensionType.Lowercase: {
        if (!isLowercase(charCode)) {
          throw new CellError(ErrorMessages.UNEXPECTED_CHARACTER);
        }

        const chars: number[] = [charCode];
        pos++;

        // Collect additional lowercase letters
        while (pos < s.length && isLowercase(s.charCodeAt(pos))) {
          chars.push(s.charCodeAt(pos));
          pos++;
        }

        const index = decodeLowercase(chars);
        if (index > MAX_INDEX_VALUE) {
          throw new CellError(ErrorMessages.INDEX_OUT_OF_RANGE);
        }

        result.indices.push(index);
        expectedType = DimensionType.Integer;
        break;
      }

      case DimensionType.Integer: {
        if (!isDigit(charCode)) {
          throw new CellError(ErrorMessages.UNEXPECTED_CHARACTER);
        }

        // Check for leading zero
        if (charCode === 48) { // '0'
          throw new CellError(ErrorMessages.LEADING_ZERO);
        }

        const chars: number[] = [charCode];
        pos++;

        // Collect additional digits
        while (pos < s.length && isDigit(s.charCodeAt(pos))) {
          chars.push(s.charCodeAt(pos));
          pos++;
        }

        const index = decodeInteger(chars);
        if (index < 0 || index > MAX_INDEX_VALUE) {
          throw new CellError(ErrorMessages.INDEX_OUT_OF_RANGE);
        }

        result.indices.push(index);
        expectedType = DimensionType.Uppercase;
        break;
      }

      case DimensionType.Uppercase: {
        if (!isUppercase(charCode)) {
          throw new CellError(ErrorMessages.UNEXPECTED_CHARACTER);
        }

        const chars: number[] = [charCode];
        pos++;

        // Collect additional uppercase letters
        while (pos < s.length && isUppercase(s.charCodeAt(pos))) {
          chars.push(s.charCodeAt(pos));
          pos++;
        }

        const index = decodeUppercase(chars);
        if (index > MAX_INDEX_VALUE) {
          throw new CellError(ErrorMessages.INDEX_OUT_OF_RANGE);
        }

        result.indices.push(index);
        expectedType = DimensionType.Lowercase;
        break;
      }
    }
  }

  return new Coordinate(...result.indices);
}

/**
 * Validates a CELL string.
 *
 * @param s - CELL coordinate string
 * @throws {CellError} with descriptive message if invalid
 */
export function validate(s: string): void {
  parse(s);
}

/**
 * Reports whether s is a valid CELL coordinate.
 *
 * @param s - CELL coordinate string
 * @returns true if valid, false otherwise
 */
export function isValid(s: string): boolean {
  try {
    parse(s);
    return true;
  } catch {
    return false;
  }
}
