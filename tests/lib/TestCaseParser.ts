import { Dictionary, IParser } from '@/types';

type TestCaseOptions = {
  case: string;
  parser: IParser<any, any, any>;
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

export class TestCaseParser {
  readonly ref: any;

  constructor(classRef: any) {
    this.ref = classRef;
  }

  Case({ parser, expected, ...args }: TestCaseOptions) {
    const schema = JSON.stringify(parser.options.schema);
    const model = parser.options.model === undefined
      ? parser.options.model
      : JSON.stringify(parser.options.model);

    describe(`Case ${args.case}: with schema = ${schema} and model = ${model}`, () => {
      parser.parse();
      toEqual('parser', parser, expected);
    });
  }
}
