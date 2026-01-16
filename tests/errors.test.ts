import { describe, expect, test } from "bun:test";
import { CellError, ErrorMessages } from "../src/errors.js";

describe("CellError", () => {
  describe("inheritance", () => {
    test("is an instance of Error", () => {
      const error = new CellError("test message");
      expect(error).toBeInstanceOf(Error);
    });

    test("is an instance of CellError", () => {
      const error = new CellError("test message");
      expect(error).toBeInstanceOf(CellError);
    });
  });

  describe("properties", () => {
    test("has name 'CellError'", () => {
      const error = new CellError("test message");
      expect(error.name).toBe("CellError");
    });

    test("has correct message", () => {
      const error = new CellError("test message");
      expect(error.message).toBe("test message");
    });

    test("has stack trace", () => {
      const error = new CellError("test message");
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe("string");
    });
  });

  describe("catch behavior", () => {
    test("can be caught as Error", () => {
      let caught = false;

      try {
        throw new CellError("test");
      } catch (e) {
        if (e instanceof Error) {
          caught = true;
        }
      }

      expect(caught).toBe(true);
    });

    test("can be caught specifically as CellError", () => {
      let caught = false;

      try {
        throw new CellError("test");
      } catch (e) {
        if (e instanceof CellError) {
          caught = true;
        }
      }

      expect(caught).toBe(true);
    });

    test("can distinguish CellError from other errors", () => {
      let isCellError = false;

      try {
        throw new CellError("test");
      } catch (e) {
        isCellError = e instanceof CellError;
      }

      expect(isCellError).toBe(true);

      let isNotCellError = true;

      try {
        throw new Error("test");
      } catch (e) {
        isNotCellError = e instanceof CellError;
      }

      expect(isNotCellError).toBe(false);
    });
  });
});

describe("ErrorMessages", () => {
  test("EMPTY_INPUT is defined", () => {
    expect(ErrorMessages.EMPTY_INPUT).toBe("empty input");
  });

  test("INPUT_TOO_LONG is defined", () => {
    expect(ErrorMessages.INPUT_TOO_LONG).toBe("input exceeds 7 characters");
  });

  test("INVALID_START is defined", () => {
    expect(ErrorMessages.INVALID_START).toBe("must start with lowercase letter");
  });

  test("UNEXPECTED_CHARACTER is defined", () => {
    expect(ErrorMessages.UNEXPECTED_CHARACTER).toBe("unexpected character");
  });

  test("LEADING_ZERO is defined", () => {
    expect(ErrorMessages.LEADING_ZERO).toBe("leading zero");
  });

  test("TOO_MANY_DIMENSIONS is defined", () => {
    expect(ErrorMessages.TOO_MANY_DIMENSIONS).toBe("exceeds 3 dimensions");
  });

  test("INDEX_OUT_OF_RANGE is defined", () => {
    expect(ErrorMessages.INDEX_OUT_OF_RANGE).toBe("index exceeds 255");
  });

  test("NO_INDICES is defined", () => {
    expect(ErrorMessages.NO_INDICES).toBe("at least one index required");
  });

  test("is immutable (frozen)", () => {
    expect(Object.isFrozen(ErrorMessages)).toBe(true);
  });
});
