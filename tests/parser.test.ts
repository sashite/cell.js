import { describe, expect, test } from "bun:test";
import { parse, validate, isValid } from "../src/parser.js";
import { CellError, ErrorMessages } from "../src/errors.js";

describe("parse", () => {
  describe("valid 1D coordinates (lowercase letters)", () => {
    test("parses 'a' as index 0", () => {
      const coord = parse("a");
      expect(coord.indices).toEqual([0]);
    });

    test("parses 'e' as index 4", () => {
      const coord = parse("e");
      expect(coord.indices).toEqual([4]);
    });

    test("parses 'z' as index 25", () => {
      const coord = parse("z");
      expect(coord.indices).toEqual([25]);
    });

    test("parses 'aa' as index 26", () => {
      const coord = parse("aa");
      expect(coord.indices).toEqual([26]);
    });

    test("parses 'ab' as index 27", () => {
      const coord = parse("ab");
      expect(coord.indices).toEqual([27]);
    });

    test("parses 'az' as index 51", () => {
      const coord = parse("az");
      expect(coord.indices).toEqual([51]);
    });

    test("parses 'ba' as index 52", () => {
      const coord = parse("ba");
      expect(coord.indices).toEqual([52]);
    });

    test("parses 'iv' as index 255", () => {
      const coord = parse("iv");
      expect(coord.indices).toEqual([255]);
    });
  });

  describe("valid 2D coordinates (lowercase + integer)", () => {
    test("parses 'a1' as (0, 0)", () => {
      const coord = parse("a1");
      expect(coord.indices).toEqual([0, 0]);
    });

    test("parses 'e4' as (4, 3)", () => {
      const coord = parse("e4");
      expect(coord.indices).toEqual([4, 3]);
    });

    test("parses 'h8' as (7, 7)", () => {
      const coord = parse("h8");
      expect(coord.indices).toEqual([7, 7]);
    });

    test("parses 'a256' as (0, 255)", () => {
      const coord = parse("a256");
      expect(coord.indices).toEqual([0, 255]);
    });

    test("parses 'iv256' as (255, 255)", () => {
      const coord = parse("iv256");
      expect(coord.indices).toEqual([255, 255]);
    });

    test("parses 'aa10' as (26, 9)", () => {
      const coord = parse("aa10");
      expect(coord.indices).toEqual([26, 9]);
    });
  });

  describe("valid 3D coordinates (lowercase + integer + uppercase)", () => {
    test("parses 'a1A' as (0, 0, 0)", () => {
      const coord = parse("a1A");
      expect(coord.indices).toEqual([0, 0, 0]);
    });

    test("parses 'e4B' as (4, 3, 1)", () => {
      const coord = parse("e4B");
      expect(coord.indices).toEqual([4, 3, 1]);
    });

    test("parses 'c3C' as (2, 2, 2)", () => {
      const coord = parse("c3C");
      expect(coord.indices).toEqual([2, 2, 2]);
    });

    test("parses 'a1Z' as (0, 0, 25)", () => {
      const coord = parse("a1Z");
      expect(coord.indices).toEqual([0, 0, 25]);
    });

    test("parses 'a1AA' as (0, 0, 26)", () => {
      const coord = parse("a1AA");
      expect(coord.indices).toEqual([0, 0, 26]);
    });

    test("parses 'a1IV' as (0, 0, 255)", () => {
      const coord = parse("a1IV");
      expect(coord.indices).toEqual([0, 0, 255]);
    });

    test("parses 'iv256IV' as (255, 255, 255)", () => {
      const coord = parse("iv256IV");
      expect(coord.indices).toEqual([255, 255, 255]);
    });
  });

  describe("invalid: empty input", () => {
    test("throws on empty string", () => {
      expect(() => parse("")).toThrow(CellError);
      expect(() => parse("")).toThrow(ErrorMessages.EMPTY_INPUT);
    });
  });

  describe("invalid: input too long", () => {
    test("throws on 8 characters", () => {
      expect(() => parse("iv256IVa")).toThrow(CellError);
      expect(() => parse("iv256IVa")).toThrow(ErrorMessages.INPUT_TOO_LONG);
    });

    test("throws on very long input", () => {
      expect(() => parse("abcdefghijklmnop")).toThrow(CellError);
      expect(() => parse("abcdefghijklmnop")).toThrow(ErrorMessages.INPUT_TOO_LONG);
    });
  });

  describe("invalid: must start with lowercase", () => {
    test("throws on uppercase start", () => {
      expect(() => parse("A")).toThrow(CellError);
      expect(() => parse("A")).toThrow(ErrorMessages.INVALID_START);
    });

    test("throws on digit start", () => {
      expect(() => parse("1")).toThrow(CellError);
      expect(() => parse("1")).toThrow(ErrorMessages.INVALID_START);
    });

    test("throws on space start", () => {
      expect(() => parse(" a1")).toThrow(CellError);
      expect(() => parse(" a1")).toThrow(ErrorMessages.INVALID_START);
    });

    test("throws on special character start", () => {
      expect(() => parse("@a1")).toThrow(CellError);
      expect(() => parse("@a1")).toThrow(ErrorMessages.INVALID_START);
    });
  });

  describe("invalid: unexpected character", () => {
    test("throws on uppercase after lowercase (missing integer)", () => {
      expect(() => parse("aA")).toThrow(CellError);
      expect(() => parse("aA")).toThrow(ErrorMessages.UNEXPECTED_CHARACTER);
    });

    test("throws on lowercase after uppercase (cycle violation)", () => {
      expect(() => parse("a1Aa")).toThrow(CellError);
      expect(() => parse("a1Aa")).toThrow(ErrorMessages.TOO_MANY_DIMENSIONS);
    });

    test("throws on special character in middle", () => {
      expect(() => parse("a@1")).toThrow(CellError);
      expect(() => parse("a@1")).toThrow(ErrorMessages.UNEXPECTED_CHARACTER);
    });

    test("throws on space in middle", () => {
      expect(() => parse("a 1")).toThrow(CellError);
      expect(() => parse("a 1")).toThrow(ErrorMessages.UNEXPECTED_CHARACTER);
    });
  });

  describe("invalid: leading zero", () => {
    test("throws on '0' as integer", () => {
      expect(() => parse("a0")).toThrow(CellError);
      expect(() => parse("a0")).toThrow(ErrorMessages.LEADING_ZERO);
    });

    test("throws on '01' (leading zero)", () => {
      expect(() => parse("a01")).toThrow(CellError);
      expect(() => parse("a01")).toThrow(ErrorMessages.LEADING_ZERO);
    });

    test("throws on '007'", () => {
      expect(() => parse("a007")).toThrow(CellError);
      expect(() => parse("a007")).toThrow(ErrorMessages.LEADING_ZERO);
    });
  });

  describe("invalid: exceeds 3 dimensions", () => {
    test("throws on 4D coordinate pattern", () => {
      expect(() => parse("a1Aa")).toThrow(CellError);
      expect(() => parse("a1Aa")).toThrow(ErrorMessages.TOO_MANY_DIMENSIONS);
    });
  });

  describe("invalid: index out of range", () => {
    test("throws on integer 257 (index 256)", () => {
      expect(() => parse("a257")).toThrow(CellError);
      expect(() => parse("a257")).toThrow(ErrorMessages.INDEX_OUT_OF_RANGE);
    });

    test("throws on integer 999 (index 998)", () => {
      expect(() => parse("a999")).toThrow(CellError);
      expect(() => parse("a999")).toThrow(ErrorMessages.INDEX_OUT_OF_RANGE);
    });

    test("throws on lowercase 'iw' (index 256)", () => {
      expect(() => parse("iw")).toThrow(CellError);
      expect(() => parse("iw")).toThrow(ErrorMessages.INDEX_OUT_OF_RANGE);
    });

    test("throws on uppercase 'IW' (index 256)", () => {
      expect(() => parse("a1IW")).toThrow(CellError);
      expect(() => parse("a1IW")).toThrow(ErrorMessages.INDEX_OUT_OF_RANGE);
    });
  });

  describe("security: malicious inputs", () => {
    test("rejects null byte injection", () => {
      expect(() => parse("a\0")).toThrow(CellError);
    });

    test("rejects newline injection", () => {
      expect(() => parse("a\n1")).toThrow(CellError);
    });

    test("rejects carriage return injection", () => {
      expect(() => parse("a\r1")).toThrow(CellError);
    });

    test("rejects tab injection", () => {
      expect(() => parse("a\t1")).toThrow(CellError);
    });

    test("rejects unicode letter lookalikes", () => {
      // Cyrillic 'а' (U+0430) looks like Latin 'a'
      expect(() => parse("\u0430")).toThrow(CellError);
    });

    test("rejects full-width characters", () => {
      // Full-width 'a' (U+FF41)
      expect(() => parse("\uFF41")).toThrow(CellError);
    });

    test("rejects combining characters", () => {
      expect(() => parse("a\u0301")).toThrow(CellError);
    });

    test("rejects zero-width characters", () => {
      expect(() => parse("a\u200B1")).toThrow(CellError);
    });

    test("handles maximum valid input without overflow", () => {
      const coord = parse("iv256IV");
      expect(coord.indices).toEqual([255, 255, 255]);
    });
  });

  describe("round-trip (parse → toString → parse)", () => {
    test("round-trips 'e4'", () => {
      const coord = parse("e4");
      const str = coord.toString();
      const reparsed = parse(str);
      expect(reparsed.indices).toEqual(coord.indices);
    });

    test("round-trips 'iv256IV'", () => {
      const coord = parse("iv256IV");
      const str = coord.toString();
      const reparsed = parse(str);
      expect(reparsed.indices).toEqual(coord.indices);
    });

    test("round-trips 'aa27AA'", () => {
      const coord = parse("aa27AA");
      const str = coord.toString();
      const reparsed = parse(str);
      expect(reparsed.indices).toEqual(coord.indices);
    });
  });
});

describe("validate", () => {
  test("returns undefined for valid input", () => {
    expect(validate("e4")).toBeUndefined();
  });

  test("throws CellError for invalid input", () => {
    expect(() => validate("")).toThrow(CellError);
  });

  test("throws with correct message for empty input", () => {
    expect(() => validate("")).toThrow(ErrorMessages.EMPTY_INPUT);
  });

  test("throws with correct message for leading zero", () => {
    expect(() => validate("a0")).toThrow(ErrorMessages.LEADING_ZERO);
  });
});

describe("isValid", () => {
  describe("returns true for valid inputs", () => {
    test("'a' is valid", () => {
      expect(isValid("a")).toBe(true);
    });

    test("'e4' is valid", () => {
      expect(isValid("e4")).toBe(true);
    });

    test("'a1A' is valid", () => {
      expect(isValid("a1A")).toBe(true);
    });

    test("'iv256IV' is valid", () => {
      expect(isValid("iv256IV")).toBe(true);
    });
  });

  describe("returns false for invalid inputs", () => {
    test("empty string is invalid", () => {
      expect(isValid("")).toBe(false);
    });

    test("'A' (uppercase start) is invalid", () => {
      expect(isValid("A")).toBe(false);
    });

    test("'a0' (leading zero) is invalid", () => {
      expect(isValid("a0")).toBe(false);
    });

    test("'aA' (missing integer) is invalid", () => {
      expect(isValid("aA")).toBe(false);
    });

    test("'a257' (index out of range) is invalid", () => {
      expect(isValid("a257")).toBe(false);
    });

    test("too long input is invalid", () => {
      expect(isValid("iv256IVa")).toBe(false);
    });
  });

  describe("does not throw", () => {
    test("returns false instead of throwing for invalid input", () => {
      let threw = false;

      try {
        isValid("");
        isValid("A");
        isValid("a0");
        isValid("@@@");
      } catch {
        threw = true;
      }

      expect(threw).toBe(false);
    });
  });
});
