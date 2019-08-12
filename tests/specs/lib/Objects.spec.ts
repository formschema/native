import { Objects } from '@/lib/Objects';

describe('lib/Objects', () => {
  describe('Objects.isObject(value)', () => {
    [ 'hello', 123, true, undefined, null, [], () => {} ].forEach((value) => {
      it(`should return false for '${value}' as scalar value`, () => {
        expect(Objects.isObject(value)).toBeFalsy();
      });
    });

    [ {} ].forEach((value) => {
      it(`should return true for '${JSON.stringify(value)}' as non scalar value`, () => {
        expect(Objects.isObject(value)).toBeTruthy();
      });
    });
  });

  describe('Objects.assign(dest, src)', () => {
    it('should successfully merge src object to the dest object', () => {
      const F = function F() {};

      const src = { a: 1, c: 2, e: { x: 1 }, d: [ 1 ], f: { g: 1 }, F };
      const dest = { a: 0, b: 1, e: { y: 2 }, d: [ 2, 3 ] };
      const expected = { a: 1, b: 1, c: 2, e: { x: 1, y: 2 }, d: [ 1 ], f: { g: 1 }, F };

      Objects.assign(dest, src);

      expect(dest).toEqual(expected);
    });
  });

  describe('Objects.clone(object)', () => {
    it('should successfully clone object', () => {
      const F = function F() {};

      const src = { a: 1, c: 2, e: { x: 1 }, d: [ 1 ], f: { g: 1 }, F };
      const expected = { a: 1, c: 2, e: { x: 1 }, d: [ 1 ], f: { g: 1 }, F };
      const result = Objects.clone(src);

      expect(result).toEqual(expected);
    });
  });

  describe('Objects.isEmpty(object)', () => {
    it('should return true with an empty object', () => {
      expect(Objects.isEmpty({})).toBeTruthy();
    });

    it('should return false with a non empty object', () => {
      const F = function F() {};
      const object = { a: 1, c: 2, e: { x: 1 }, d: [ 1 ], f: { g: 1 }, F };

      expect(Objects.isEmpty(object)).toBe(false);
    });
  });

  describe('Objects.clear(object)', () => {
    it('should clear an empty object', () => {
      const object = {};

      Objects.clear(object);

      expect(object).toEqual({});
    });

    it('should delete all properties', () => {
      const F = function F() {};
      const object = { a: 1, c: 2, e: { x: 1 }, d: [ 1 ], f: { g: 1 }, F };

      Objects.clear(object);

      expect(object).toEqual({});
    });
  });
});
