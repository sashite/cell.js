# cell.js

[![npm version](https://img.shields.io/npm/v/@sashite/cell.svg)](https://www.npmjs.com/package/@sashite/cell)
[![License](https://img.shields.io/github/license/sashite/cell.js)](https://github.com/sashite/cell.js/blob/main/LICENSE)

> **CELL** (Coordinate Encoding for Layered Locations) implementation for JavaScript/TypeScript.

## Overview

This library implements the [CELL Specification v1.0.0](https://sashite.dev/specs/cell/1.0.0/).

### Implementation Constraints

| Constraint | Value | Rationale |
|------------|-------|-----------|
| Max dimensions | 3 | Sufficient for 1D, 2D, 3D boards |
| Max index value | 255 | Fits in 8-bit integer, covers 256×256×256 boards |
| Max string length | 7 | `"iv256IV"` (max for all dimensions at 255) |

These constraints enable bounded memory usage and safe parsing.

## Installation

```bash
npm install @sashite/cell
```

Or with other package managers:

```bash
yarn add @sashite/cell
bun add @sashite/cell
```

## Usage

### Parsing (String → Coordinate)

Convert a CELL string into a `Coordinate` object.

```typescript
import { parse } from "@sashite/cell";

// Standard parsing (throws on error)
const coord = parse("e4");
console.log(coord.indices);    // [4, 3]
console.log(coord.dimensions); // 2

// 3D coordinate
const coord3d = parse("a1A");
console.log(coord3d.indices); // [0, 0, 0]

// Invalid input throws CellError
parse("a0"); // throws CellError: "leading zero"
```

### Formatting (Coordinate → String)

Convert a `Coordinate` back to a CELL string.

```typescript
import { Coordinate, format } from "@sashite/cell";

// From Coordinate object
const coord = new Coordinate(4, 3);
console.log(coord.toString()); // "e4"

// Direct formatting (convenience)
console.log(format(2, 2, 2)); // "c3C"
```

### Validation

```typescript
import { isValid, validate } from "@sashite/cell";

// Boolean check
if (isValid("e4")) {
  // valid coordinate
}

// Detailed error
validate("a0"); // throws CellError: "leading zero"
```

### Accessing Coordinate Data

```typescript
import { parse } from "@sashite/cell";

const coord = parse("e4");

// Get dimensions count
console.log(coord.dimensions); // 2

// Get indices as readonly array
console.log(coord.indices); // [4, 3]

// Access individual index
console.log(coord.at(0)); // 4
console.log(coord.at(1)); // 3
```

## API Reference

### Types

```typescript
/**
 * Coordinate represents a parsed CELL coordinate with up to 3 dimensions.
 * Use new Coordinate() or parse() to create.
 */
class Coordinate {
  /**
   * Creates a Coordinate from 1 to 3 indices.
   * @param indices - 0-indexed coordinate values (0-255)
   * @throws {CellError} if no indices provided or more than 3
   */
  constructor(...indices: number[]);

  /**
   * Returns the number of dimensions (1, 2, or 3).
   */
  readonly dimensions: number;

  /**
   * Returns the coordinate indices as a readonly array.
   */
  readonly indices: readonly number[];

  /**
   * Returns the index at dimension i (0-indexed).
   * @throws {RangeError} if i >= dimensions
   */
  at(i: number): number;

  /**
   * Returns the CELL string representation.
   */
  toString(): string;
}
```

### Constants

```typescript
const MAX_DIMENSIONS: number = 3;
const MAX_INDEX_VALUE: number = 255;
const MAX_STRING_LENGTH: number = 7;
```

### Parsing

```typescript
/**
 * Parses a CELL string into a Coordinate.
 * @param s - CELL coordinate string
 * @returns Coordinate
 * @throws {CellError} if the string is not valid
 */
function parse(s: string): Coordinate;
```

### Formatting

```typescript
/**
 * Formats indices into a CELL string.
 * Convenience function equivalent to new Coordinate(...indices).toString().
 * @param indices - 0-indexed coordinate values
 * @returns CELL string
 */
function format(...indices: number[]): string;
```

### Validation

```typescript
/**
 * Validates a CELL string.
 * @param s - CELL coordinate string
 * @throws {CellError} with descriptive message if invalid
 */
function validate(s: string): void;

/**
 * Reports whether s is a valid CELL coordinate.
 * @param s - CELL coordinate string
 * @returns true if valid, false otherwise
 */
function isValid(s: string): boolean;
```

### Errors

All parsing and validation errors throw `CellError` with descriptive messages:

| Message | Cause |
|---------|-------|
| `"empty input"` | String length is 0 |
| `"input exceeds 7 characters"` | String too long |
| `"must start with lowercase letter"` | Invalid first character |
| `"unexpected character"` | Character violates the cyclic sequence |
| `"leading zero"` | Numeric part starts with '0' |
| `"exceeds 3 dimensions"` | More than 3 dimensions |
| `"index exceeds 255"` | Decoded value out of range |

```typescript
import { CellError, parse } from "@sashite/cell";

try {
  parse("a0");
} catch (error) {
  if (error instanceof CellError) {
    console.log(error.message); // "leading zero"
  }
}
```

## Design Principles

- **Bounded values**: Index validation prevents overflow
- **Class-based**: `Coordinate` class enables methods and encapsulation
- **TypeScript-first**: Full type definitions for type safety
- **Immutable coordinates**: Readonly indices array prevents mutation
- **Custom error class**: `CellError` for precise error handling
- **No dependencies**: Pure JavaScript/TypeScript only

## Related Specifications

- [Game Protocol](https://sashite.dev/game-protocol/) — Conceptual foundation
- [CELL Specification](https://sashite.dev/specs/cell/1.0.0/) — Official specification
- [CELL Examples](https://sashite.dev/specs/cell/1.0.0/examples/) — Usage examples

## License

Available as open source under the [Apache License 2.0](https://opensource.org/licenses/Apache-2.0).
