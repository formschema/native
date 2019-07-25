import { Arrays } from '@/lib/Arrays';

describe('lib/Arrays', () => {
  describe('Arrays.index(items, item)', () => {
    it('should successfully return the item\'s index', () => {
      const result = Arrays.index([2], 2);
      const expected = 0;

      expect(result).toEqual(expected);
    });

    it('should return -1 for unexistance item', () => {
      const result = Arrays.index([2], 1);
      const expected = -1;

      expect(result).toEqual(expected);
    });
  });

  describe('Arrays.swap(items, from, to)', () => {
    it('should successfully swap items', () => {
      const items = [0, 1, 2];
      const expected = [2, 1, 0];
      const movedItem = Arrays.swap(items, 0, 2);

      expect(items).toEqual(expected);
      expect(movedItem).toEqual(0);
    });
  });
});
