import { Parser } from '@/parsers/Parser';
import { UIDescriptor } from '@/descriptors/UIDescriptor';
import { ParserOptions, DescriptorInstance, UnknowField, IDescriptor, UnknowParser } from '@/types';

import '@/parsers';
import '@/descriptors';

export interface GetOptions extends ParserOptions<any> {
  descriptor?: DescriptorInstance;
};

export interface Context {
  props: {
    field: UnknowField;
    descriptor: IDescriptor;
  };
}

export interface GetResult {
  context: Context;
  parser: UnknowParser;
  descriptor: IDescriptor;
  schema: any;
  options: any;
}

export const Options = {
  get({ descriptor: descriptorOptions = {}, ...options }: GetOptions): GetResult {
    if (descriptorOptions.kind) {
      options.kind = descriptorOptions.kind;
    }

    const parser = Parser.get(options);

    if (parser === null) {
      throw new Error('Parser cannot be null');
    }

    const field = parser.field;
    const descriptor = UIDescriptor.get(descriptorOptions, field);

    const context = {
      props: { field, descriptor }
    };

    const schema = options.schema as any;

    return { context, parser, schema, descriptor, options };
  }
};
