import { Dictionary, IParser } from '@/types';
import { Parser } from '@/parsers/Parser';

type TParser = IParser<any, any, any>;
type TestCaseOptions = {
  case: string;
  description?: string;
  parser: TParser | (() => TParser);
  expected: Dictionary<any>;
};

function toEqual(prefix: string, actual: Dictionary<any>, expected: Dictionary<any>) {
  Object.keys(expected).forEach((key) => {
    if (expected[key] instanceof Function) {
      it(`${prefix}.${key} validation should be succeed`, () => {
        expect(expected[key](actual[key], expected[key])).toBeTruthy();
      });
    } else if (typeof expected[key] === 'object' && expected[key] !== null && !Array.isArray(expected[key])) {
      toEqual(`${prefix}.${key}`, actual[key], expected[key]);
    } else {
      it(`${prefix}.${key} should be equal to ${JSON.stringify(expected[key])}`, () => {
        expect(actual[key]).toEqual(expected[key]);
      });
    }
  });
}

export const TestParser = {
  Case({ description, parser, expected, ...args }: TestCaseOptions) {
    const p = parser instanceof Function ? parser() : parser;
    const schema = JSON.stringify(p.options.schema);
    const model = p.options.model === undefined
      ? p.options.model
      : JSON.stringify(p.options.model);

    const desc = description || `with schema = ${schema} and model = ${model}`;

    describe(`Case ${args.case}: ${desc}`, () => {
      if (parser instanceof Parser) {
        p.parse();
      }

      toEqual('parser', p, expected);
    });
  }
}
