import { Parser } from '@/parsers/Parser';

import {
  ParserOptions,
  DescriptorInstance,
  UnknowField,
  IUIDescriptor,
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
  };
}

export interface GetResult {
  context: Context;
  parser: UnknowParser;
  field: UnknowField;
  descriptor: IUIDescriptor;
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
    const { descriptor } = field;

    const context = {
      props: { field }
    };

    const schema = options.schema as any;

    return {
      context, parser, schema, descriptor, options, field
    };
  }
};
