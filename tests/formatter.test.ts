import { describe, expect, test } from "bun:test";
import { format } from "../src/formatter.js";
import { parse } from "../src/parser.js";
import { CellError, ErrorMessages } from "../src/errors.js";

describe("format", () => {
  describe("1D coordinates", () => {
    test("formats index 0 as 'a'", () => {
      expect(format(0)).toBe("a");
    });

    test("formats index 25 as 'z'", () => {
      expect(format(25)).toBe("z");
    });

    test("formats index 26 as 'aa'", () => {
      expect(format(26)).toBe("aa");
    });

    test("formats index 255 as 'iv'", () => {
      expect(format(255)).toBe("iv");
    });
  });

  describe("2D coordinates", () => {
    test("formats (0, 0) as 'a1'", () => {
      expect(format(0, 0)).toBe("a1");
    });

    test("formats (4, 3) as 'e4'", () => {
      expect(format(4, 3)).toBe("e4");
    });

    test("formats (255, 255) as 'iv256'", () => {
      expect(format(255, 255)).toBe("iv256");
    });
  });

  describe("3D coordinates", () => {
    test("formats (0, 0, 0) as 'a1A'", () => {
      expect(format(0, 0, 0)).toBe("a1A");
    });

    test("formats (2, 2, 2) as 'c3C'", () => {
      expect(format(2, 2, 2)).toBe("c3C");
    });

    test("formats (255, 255, 255) as 'iv256IV'", () => {
      expect(format(255, 255, 255)).toBe("iv256IV");
    });
  });

  describe("error propagation", () => {
    test("throws on no indices", () => {
      expect(() => format()).toThrow(CellError);
      expect(() => format()).toThrow(ErrorMessages.NO_INDICES);
    });

    test("throws on more than 3 indices", () => {
      expect(() => format(0, 0, 0, 0)).toThrow(CellError);
      expect(() => format(0, 0, 0, 0)).toThrow(ErrorMessages.TOO_MANY_DIMENSIONS);
    });

    test("throws on negative index", () => {
      expect(() => format(-1)).toThrow(CellError);
      expect(() => format(-1)).toThrow(ErrorMessages.INDEX_OUT_OF_RANGE);
    });

    test("throws on index greater than 255", () => {
      expect(() => format(256)).toThrow(CellError);
      expect(() => format(256)).toThrow(ErrorMessages.INDEX_OUT_OF_RANGE);
    });
  });

  describe("round-trip (format → parse → format)", () => {
    test("round-trips 1D coordinate", () => {
      const original = format(4);
      const parsed = parse(original);
      const result = format(...parsed.indices);
      expect(result).toBe(original);
    });

    test("round-trips 2D coordinate", () => {
      const original = format(4, 3);
      const parsed = parse(original);
      const result = format(...parsed.indices);
      expect(result).toBe(original);
    });

    test("round-trips 3D coordinate", () => {
      const original = format(2, 2, 2);
      const parsed = parse(original);
      const result = format(...parsed.indices);
      expect(result).toBe(original);
    });

    test("round-trips minimum values (0, 0, 0)", () => {
      const original = format(0, 0, 0);
      const parsed = parse(original);
      const result = format(...parsed.indices);
      expect(result).toBe(original);
    });

    test("round-trips maximum values (255, 255, 255)", () => {
      const original = format(255, 255, 255);
      const parsed = parse(original);
      const result = format(...parsed.indices);
      expect(result).toBe(original);
    });

    test("round-trips boundary value 25 (single letter)", () => {
      const original = format(25, 25, 25);
      const parsed = parse(original);
      const result = format(...parsed.indices);
      expect(result).toBe(original);
    });

    test("round-trips boundary value 26 (double letters)", () => {
      const original = format(26, 26, 26);
      const parsed = parse(original);
      const result = format(...parsed.indices);
      expect(result).toBe(original);
    });
  });
});
