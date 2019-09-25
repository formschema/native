import { Parser } from '@/parsers/Parser';

import {
  ParserOptions,
  UnknowParser,
  ISetDescriptor,
  SetField,
  SetDescriptor,
  ISetParser,
  UnknowField
} from '@/types';

export abstract class SetParser<
  TModel,
  TField extends SetField<any, TModel, UnknowField>,
  TDescriptor extends ISetDescriptor
> extends Parser<TModel, TField, TDescriptor> implements ISetParser<TModel, TField> {
  constructor(
    kind: 'enum' | 'array' | 'object',
    options: ParserOptions<TModel, TField, SetDescriptor>,
    parent?: UnknowParser
  ) {
    super(kind, options, parent);

    this.field.hasChildren = true;

    this.field.clearMessages = (recursive = false) => {
      this.field.messages.splice(0);

      if (recursive) {
        this.field.childrenList.forEach((child) => child.clearMessages(true));
      }
    };

    Object.defineProperty(this.field, 'childrenList', {
      enumerable: true,
      get: () => Object.values(this.field.children)
    });

    this.field.getField = (path) => {
      const paths = path.substring(1).split('.');
      let children = this.field.children;
      let foundField = null;

      for (const currentPath of paths) {
        for (const key in children) {
          if (key === currentPath) {
            foundField = children[key];

            if (foundField.hasChildren) {
              children = (foundField as any).children;

              break;
            }

            return foundField;
          }
        }
      }

      return foundField;
    };
  }
}
