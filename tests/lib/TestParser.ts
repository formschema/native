import { Dict, IParser, IDescriptor } from '@/types';
import { Parser } from '@/parsers/Parser';

import '@/parsers';
import '@/descriptors';

type TParser = IParser<any>;

type Given<P> = {
  parser: P
};

type ExpectedCall = (scope: Scope) => void;

type TestCaseOptions = {
  case: string;
  description?: string;
  given: Given<TParser | (() => TParser) | any>;
  expected: {
    parser?: Dict<ExpectedCall | any>;
    descriptor?: Dict<ExpectedCall | any>;
  };
};

export interface Scope<
  P extends TParser = TParser,
  D extends IDescriptor = IDescriptor
> {
  value: any;
  parser: Required<P>;
  options: any;
  field: any;
  schema: any;
  descriptor: Required<D>;
  given: Required<Given<P>>;
};

function toEqual(parser: any, prefix: string, actual: any, expected: Dict<any>, given: any) {
  Object.keys(expected).forEach((key) => {
    if (typeof expected[key] === 'function') {
      it(`${prefix}.${key} validation should be succeed`, () => {
        const result = expected[key]({
          value: actual[key],
          parser: parser,
          options: parser.options,
          field: parser.field,
          schema: parser.schema,
          descriptor: parser.descriptor,
          given
        }) !== false;

        expect(result).toBeTruthy();
      });
    } else if (typeof expected[key] === 'object' && expected[key] !== null) {
      toEqual(parser, `${prefix}.${key}`, actual[key], expected[key], given);
    } else {
      it(`${prefix}.${key} should be equal to ${JSON.stringify(expected[key])}`, () => {
        expect(actual[key]).toEqual(expected[key]);
      });
    }
  });
}

export const TestParser = {
  Case({ description, given, expected, ...args }: TestCaseOptions) {
    const p = typeof given.parser === 'function'
      ? given.parser()
      : given.parser instanceof Parser
        ? given.parser
        : Parser.get(given.parser as any);

    if (!p) {
      return;
    }

    if (typeof given.parser !== 'function' && !given.parser.options.descriptor) {
      (given.parser.options as any).descriptor = {};
    }

    const schema = JSON.stringify(p.options.schema);
    const model = p.options.model === undefined
      ? p.options.model
      : JSON.stringify(p.options.model);

    const desc = description || `with schema = ${schema} and model = ${model}`;

    describe(`Case ${args.case}: ${desc}`, () => {
      if (given.parser instanceof Parser) {
        p.parse();
      }

      if (expected.parser) {
        toEqual(p, 'parser', p, expected.parser, given);
      }
    });
  }
}
