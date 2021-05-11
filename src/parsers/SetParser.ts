import { Parser } from '@/parsers/Parser';

import {
  ParserOptions,
  UnknowParser,
  ISetDescriptor,
  SetField,
  SetDescriptor,
  ISetParser,
  UnknowField,
  UnknowSetField
} from '@/types';

const RE_ARRAY_PATH = /(.+)?\[(\d+)\]$/;

function getFieldByIndex(field: UnknowSetField, index: string) {
  const parsedIndex = Number.parseInt(index, 10);
  const indexField = field.children[parsedIndex];

  return indexField || null;
}

export abstract class SetParser<
  TModel,
  TField extends SetField<any, ISetDescriptor, TModel, UnknowField>,
  TSetDescriptor extends SetDescriptor,
  TSetUIDescriptor extends ISetDescriptor
> extends Parser<TModel, TField, TSetDescriptor, TSetUIDescriptor> implements ISetParser<TModel, TField, TSetDescriptor> {
  constructor(
    kind: 'enum' | 'array' | 'object',
    options: ParserOptions<TModel, TField, TSetDescriptor>,
    parent?: UnknowParser
  ) {
    super(kind, options, parent);

    this.field.hasChildren = true;

    this.field.clearMessages = (recursive = false) => {
      this.field.messages.splice(0);

      if (recursive) {
        this.field.children.forEach((child) => child.clearMessages(true));
      }
    };

    this.field.getField = (path) => {
      const formatedPath = path[0] === '.' ? path.substring(1) : path;

      if (!formatedPath) {
        return this.field;
      }

      const paths = formatedPath.split('.');
      let fields = this.field.fields;
      let foundField: UnknowField | null = null;

      for (let currentPath of paths) {
        const match = RE_ARRAY_PATH.exec(currentPath);

        if (match) {
          if (match[1]) {
            currentPath = match[1];
          } else {
            // case path === '[index]'
            foundField = foundField || this.field;

            return getFieldByIndex(foundField as UnknowSetField, match[2]);
          }
        }

        for (const key in fields) {
          if (key === currentPath) {
            foundField = fields[key];

            if (match) {
              foundField = getFieldByIndex(foundField as UnknowSetField, match[2]);
            }

            if (foundField && foundField.hasChildren) {
              fields = (foundField as any).fields;

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
