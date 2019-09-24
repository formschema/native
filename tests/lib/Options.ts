import { Parser } from '@/parsers/Parser';

import {
  ParserOptions,
  DescriptorInstance,
  UnknowField,
  IDescriptor,
  UnknowParser
} from '@/types';

import '@/parsers';
import '@/descriptors';

export interface GetOptions extends ParserOptions<any, any> {
  descriptor?: DescriptorInstance;
}

export interface Context {
  props: {
    field: UnknowField;
    descriptor: IDescriptor;
  };
}

export interface GetResult {
  context: Context;
  parser: UnknowParser;
  field: UnknowField;
  descriptor: IDescriptor;
  schema: any;
  options: any;
}

export const Options = {
  get(options: GetOptions): GetResult {
    const parser = Parser.get(options);

    if (parser === null) {
      throw new Error('Parser cannot be null');
    }

    const { field } = parser;
    const { descriptor } = parser;

    const context = {
      props: { field, descriptor }
    };

    const schema = options.schema as any;

    return {
      context, parser, schema, descriptor, options, field
    };
  }
};
