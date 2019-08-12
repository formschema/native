import { Dict, IParser, SchemaDescriptor, IDescriptor } from '@/types';
import { Parser } from '@/parsers/Parser';
import { UIDescriptor } from '@/descriptors/UIDescriptor';

import '@/parsers';
import '@/descriptors';

type TParser = IParser<any>;

type Given<P, D extends SchemaDescriptor = SchemaDescriptor> = {
  parser: P;
  descriptor?: D;
};

type ExpectedCall = (scope: Scope) => void;

type TestCaseOptions<D extends SchemaDescriptor = SchemaDescriptor> = {
  case: string;
  description?: string;
  given: Given<TParser | (() => TParser), D>;
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
  parser: P;
  descriptor: D;
  given: Required<Given<P>>;
};

function toEqual(parser: any, prefix: string, actual: any, expected: Dict<any>, o: string, given: any) {
  Object.keys(expected).forEach((key) => {
    if (typeof expected[key] === 'function') {
      it(`${prefix}.${key} validation should be succeed`, () => {
        const result = expected[key]({ value: actual[key], [o]: parser, given }) !== false;

        expect(result).toBeTruthy();
      });
    } else if (typeof expected[key] === 'object' && expected[key] !== null) {
      toEqual(parser, `${prefix}.${key}`, actual[key], expected[key], o, given);
    } else {
      it(`${prefix}.${key} should be equal to ${JSON.stringify(expected[key])}`, () => {
        expect(actual[key]).toEqual(expected[key]);
      });
    }
  });
}

export const TestParser = {
  Case({ description, given, expected, ...args }: TestCaseOptions<any>) {
    const p = typeof given.parser === 'function' ? given.parser() : given.parser;
    const schema = JSON.stringify(p.options.schema);
    const model = p.options.model === undefined
      ? p.options.model
      : JSON.stringify(p.options.model);

    const desc = description || `with schema = ${schema} and model = ${model}`;

    describe(`Case ${args.case}: ${desc}`, () => {
      if (given.parser instanceof Parser) {
        p.parse();
      }

      given.parser = p;

      if (expected.parser) {
        toEqual(p, 'parser', p, expected.parser, 'parser', given);
      }

      if (expected.descriptor) {
        if (!given.descriptor) {
          given.descriptor = {};
        }

        const d = UIDescriptor.get(given.descriptor, p.field);

        toEqual(d, 'descriptor', d, expected.descriptor, 'descriptor', given);
      }
    });
  }
}
