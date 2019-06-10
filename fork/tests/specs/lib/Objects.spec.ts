import { Objects } from '@/lib/Objects';

describe('lib/Objects', () => {
  describe('Objects.equals(o1, o2)', () => {
    it('should return false for inputs with not equal keys length', () => {
      const o1 = { a: 1 };
      const o2 = { a: 1, b: 2 };

      expect(Objects.equals(o1, o2)).toEqual(false);
    });

    it('should return false for different inputs with equal keys length', () => {
      const o1 = { a: 1, b: 3 };
      const o2 = { a: 1, b: 2 };

      expect(Objects.equals(o1, o2)).toEqual(false);
    });

    it('should return true for different inputs with equal ordered keys', () => {
      const o1 = { a: 1, b: 3 };
      const o2 = { a: 1, b: 3 };

      expect(Objects.equals(o1, o2)).toBeTruthy();
    });

    it('should return true for different inputs with equal non ordered keys', () => {
      const o1 = { a: 1, b: 3 };
      const o2 = { b: 3, a: 1 };

      expect(Objects.equals(o1, o2)).toBeTruthy();
    });

    it('should return true for empty inputs', () => {
      const o1 = {};
      const o2 = {};

      expect(Objects.equals(o1, o2)).toBeTruthy();
    });

    it('should return true with for identical scalar inputs', () => {
      const o1 = 1;
      const o2 = 1;

      expect(Objects.equals(o1, o2)).toBeTruthy();
    });

    it('should return false for different scalar inputs', () => {
      const o1 = 1;
      const o2 = 2;

      expect(Objects.equals(o1, o2)).toBe(false);
    });
  });

  describe('Objects.isScalar(value)', () => {
    [ 'hello', 123, true, undefined, null ].forEach((value) => {
      it(`should return true for '${value}' as scalar value`, () => {
        expect(Objects.isScalar(value)).toBeTruthy();
      });
    });

    [ {}, [] ].forEach((value) => {
      it(`should return false for '${JSON.stringify(value)}' as non scalar value`, () => {
        expect(Objects.isScalar(value)).toBe(false);
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

  describe('Objects.clear(object)', () => {
    it('should successfully clear object', () => {
      const F = function F() {};

      const object = { a: 1, c: 2, e: { x: 1 }, d: [ 1 ], f: { g: 1 }, F };
      const expected = {};

      Objects.clear(object);
      expect(object).toEqual(expected);
    });
  });

  describe('clear(object)', () => {
    it('should return true with an empty object', () => {
      expect(Objects.isEmpty({})).toBeTruthy();
    })

    it('should return false with a non empty object', () => {
      const F = function F() {};
      const object = { a: 1, c: 2, e: { x: 1 }, d: [ 1 ], f: { g: 1 }, F };

      expect(Objects.isEmpty(object)).toBe(false);
    });
  });
});
