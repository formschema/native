import { Pattern } from '@/lib/Pattern';

describe('lib/Pattern', () => {
  describe('Pattern.escape(str)', () => {
    it('should successfully escape a cleaned string', () => {
      expect(Pattern.escape('arya')).toBe('arya');
    });

    it('should successfully escape a ugly string', () => {
      const string = 'f(x) = ax + b; a = { 1, 2 }';
      const expected = 'f\\(x\\) = ax \\+ b; a = \\{ 1, 2 \\}';

      expect(Pattern.escape(string)).toBe(expected);
    });
  });
});
