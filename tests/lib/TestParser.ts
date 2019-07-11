import { Dictionary, IParser } from '@/types';
import { Parser } from '@/parsers/Parser';

type TParser = IParser<any, any, any>;
type TestCaseOptions = {
  case: string;
  parser: TParser | (() => TParser);
  expected: Dictionary<any>;
};

function toEqual(prefix: string, actual: Dictionary<any>, expected: Dictionary<any>) {
  Object.keys(expected).forEach((key) => {
    if (expected[key] instanceof Function) {
      expect(expected[key](actual[key], expected[key])).toBeTruthy();
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
  Case({ parser, expected, ...args }: TestCaseOptions) {
    const p = parser instanceof Function ? parser() : parser;
    const schema = JSON.stringify(p.options.schema);
    const model = p.options.model === undefined
      ? p.options.model
      : JSON.stringify(p.options.model);

    describe(`Case ${args.case}: with schema = ${schema} and model = ${model}`, () => {
      if (parser instanceof Parser) {
        p.parse();
      }

      toEqual('parser', p, expected);
    });
  }
}
