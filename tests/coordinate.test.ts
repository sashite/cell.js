import { describe, expect, test } from "bun:test";
import { Coordinate } from "../src/coordinate.js";
import { CellError, ErrorMessages } from "../src/errors.js";

describe("Coordinate", () => {
  describe("constructor", () => {
    test("creates 1D coordinate", () => {
      const coord = new Coordinate(0);
      expect(coord.dimensions).toBe(1);
      expect(coord.indices).toEqual([0]);
    });

    test("creates 2D coordinate", () => {
      const coord = new Coordinate(4, 3);
      expect(coord.dimensions).toBe(2);
      expect(coord.indices).toEqual([4, 3]);
    });

    test("creates 3D coordinate", () => {
      const coord = new Coordinate(0, 0, 0);
      expect(coord.dimensions).toBe(3);
      expect(coord.indices).toEqual([0, 0, 0]);
    });

    test("accepts index 0", () => {
      const coord = new Coordinate(0);
      expect(coord.indices).toEqual([0]);
    });

    test("accepts index 255", () => {
      const coord = new Coordinate(255);
      expect(coord.indices).toEqual([255]);
    });

    test("throws on no indices", () => {
      expect(() => new Coordinate()).toThrow(CellError);
      expect(() => new Coordinate()).toThrow(ErrorMessages.NO_INDICES);
    });

    test("throws on more than 3 indices", () => {
      expect(() => new Coordinate(0, 0, 0, 0)).toThrow(CellError);
      expect(() => new Coordinate(0, 0, 0, 0)).toThrow(ErrorMessages.TOO_MANY_DIMENSIONS);
    });

    test("throws on negative index", () => {
      expect(() => new Coordinate(-1)).toThrow(CellError);
      expect(() => new Coordinate(-1)).toThrow(ErrorMessages.INDEX_OUT_OF_RANGE);
    });

    test("throws on index greater than 255", () => {
      expect(() => new Coordinate(256)).toThrow(CellError);
      expect(() => new Coordinate(256)).toThrow(ErrorMessages.INDEX_OUT_OF_RANGE);
    });

    test("throws on non-integer index", () => {
      expect(() => new Coordinate(1.5)).toThrow(CellError);
      expect(() => new Coordinate(1.5)).toThrow(ErrorMessages.INDEX_OUT_OF_RANGE);
    });

    test("throws on NaN index", () => {
      expect(() => new Coordinate(NaN)).toThrow(CellError);
      expect(() => new Coordinate(NaN)).toThrow(ErrorMessages.INDEX_OUT_OF_RANGE);
    });

    test("throws on Infinity index", () => {
      expect(() => new Coordinate(Infinity)).toThrow(CellError);
      expect(() => new Coordinate(Infinity)).toThrow(ErrorMessages.INDEX_OUT_OF_RANGE);
    });
  });

  describe("dimensions", () => {
    test("returns 1 for 1D coordinate", () => {
      expect(new Coordinate(5).dimensions).toBe(1);
    });

    test("returns 2 for 2D coordinate", () => {
      expect(new Coordinate(4, 3).dimensions).toBe(2);
    });

    test("returns 3 for 3D coordinate", () => {
      expect(new Coordinate(0, 0, 0).dimensions).toBe(3);
    });
  });

  describe("indices", () => {
    test("returns readonly array", () => {
      const coord = new Coordinate(4, 3);
      expect(coord.indices).toEqual([4, 3]);
      expect(Object.isFrozen(coord.indices)).toBe(true);
    });

    test("returns same reference on multiple calls", () => {
      const coord = new Coordinate(4, 3);
      expect(coord.indices).toBe(coord.indices);
    });
  });

  describe("at", () => {
    test("returns correct index for valid position", () => {
      const coord = new Coordinate(4, 3, 2);
      expect(coord.at(0)).toBe(4);
      expect(coord.at(1)).toBe(3);
      expect(coord.at(2)).toBe(2);
    });

    test("throws RangeError for negative position", () => {
      const coord = new Coordinate(4, 3);
      expect(() => coord.at(-1)).toThrow(RangeError);
    });

    test("throws RangeError for position >= dimensions", () => {
      const coord = new Coordinate(4, 3);
      expect(() => coord.at(2)).toThrow(RangeError);
      expect(() => coord.at(3)).toThrow(RangeError);
    });

    test("throws RangeError for non-integer position", () => {
      const coord = new Coordinate(4, 3);
      expect(() => coord.at(0.5)).toThrow(RangeError);
    });
  });

  describe("toString", () => {
    describe("1D coordinates (lowercase letters)", () => {
      test("encodes index 0 as 'a'", () => {
        expect(new Coordinate(0).toString()).toBe("a");
      });

      test("encodes index 4 as 'e'", () => {
        expect(new Coordinate(4).toString()).toBe("e");
      });

      test("encodes index 25 as 'z'", () => {
        expect(new Coordinate(25).toString()).toBe("z");
      });

      test("encodes index 26 as 'aa'", () => {
        expect(new Coordinate(26).toString()).toBe("aa");
      });

      test("encodes index 27 as 'ab'", () => {
        expect(new Coordinate(27).toString()).toBe("ab");
      });

      test("encodes index 51 as 'az'", () => {
        expect(new Coordinate(51).toString()).toBe("az");
      });

      test("encodes index 52 as 'ba'", () => {
        expect(new Coordinate(52).toString()).toBe("ba");
      });

      test("encodes index 255 as 'iv'", () => {
        expect(new Coordinate(255).toString()).toBe("iv");
      });
    });

    describe("2D coordinates (lowercase + integer)", () => {
      test("encodes (0, 0) as 'a1'", () => {
        expect(new Coordinate(0, 0).toString()).toBe("a1");
      });

      test("encodes (4, 3) as 'e4' (chess e4)", () => {
        expect(new Coordinate(4, 3).toString()).toBe("e4");
      });

      test("encodes (7, 7) as 'h8' (chess h8)", () => {
        expect(new Coordinate(7, 7).toString()).toBe("h8");
      });

      test("encodes (0, 255) as 'a256'", () => {
        expect(new Coordinate(0, 255).toString()).toBe("a256");
      });

      test("encodes (255, 255) as 'iv256'", () => {
        expect(new Coordinate(255, 255).toString()).toBe("iv256");
      });
    });

    describe("3D coordinates (lowercase + integer + uppercase)", () => {
      test("encodes (0, 0, 0) as 'a1A'", () => {
        expect(new Coordinate(0, 0, 0).toString()).toBe("a1A");
      });

      test("encodes (4, 3, 1) as 'e4B'", () => {
        expect(new Coordinate(4, 3, 1).toString()).toBe("e4B");
      });

      test("encodes (2, 2, 2) as 'c3C'", () => {
        expect(new Coordinate(2, 2, 2).toString()).toBe("c3C");
      });

      test("encodes (0, 0, 25) as 'a1Z'", () => {
        expect(new Coordinate(0, 0, 25).toString()).toBe("a1Z");
      });

      test("encodes (0, 0, 26) as 'a1AA'", () => {
        expect(new Coordinate(0, 0, 26).toString()).toBe("a1AA");
      });

      test("encodes (0, 0, 255) as 'a1IV'", () => {
        expect(new Coordinate(0, 0, 255).toString()).toBe("a1IV");
      });

      test("encodes (255, 255, 255) as 'iv256IV'", () => {
        expect(new Coordinate(255, 255, 255).toString()).toBe("iv256IV");
      });
    });
  });
});
