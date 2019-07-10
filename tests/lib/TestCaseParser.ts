import { Dictionary } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';

type TestCaseOptions = {
  case: string;
  options: Dictionary<any>;
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

  Case({ options, expected, ...args }: TestCaseOptions) {
    const schema = JSON.stringify(options.schema);
    const model = options.model === undefined
      ? options.model
      : JSON.stringify(options.model);

    describe(`Case ${args.case}: with schema = ${schema} and model = ${model}`, () => {
      const parser: any = new this.ref({
        descriptorConstructor: NativeDescriptor.get,
        ...options
      } as any);

      parser.parse();
      toEqual('parser', parser, expected);
    });
  }
}
