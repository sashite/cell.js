/**
 * Maximum number of dimensions supported by a CELL coordinate.
 * Sufficient for 1D, 2D, and 3D game boards.
 */
export const MAX_DIMENSIONS: number = 3;

/**
 * Maximum value for a single coordinate index.
 * Fits in an 8-bit unsigned integer (0-255).
 */
export const MAX_INDEX_VALUE: number = 255;

/**
 * Maximum length of a CELL string representation.
 * Corresponds to "iv256IV" (worst case for all dimensions at 255).
 */
export const MAX_STRING_LENGTH: number = 7;
