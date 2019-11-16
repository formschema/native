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
  const indexField = field.childrenList[parsedIndex];

  return indexField || null;
}

export abstract class SetParser<
  TModel,
  TField extends SetField<any, ISetDescriptor, TModel, UnknowField>,
  TSetDescriptor extends SetDescriptor,
  TSetUIDescriptor extends ISetDescriptor
> extends Parser<TModel, TField, TSetDescriptor, TSetUIDescriptor> implements ISetParser<TModel, TField, TSetDescriptor> {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    kind: 'enum' | 'array' | 'object',
    options: ParserOptions<TModel, TField, TSetDescriptor>,
    parent?: UnknowParser
  ) {
    super(kind, options, parent);
  }

  parseField() {
    super.parseField();

    this.field.hasChildren = true;

    this.field.clearMessages = (recursive = false) => {
      this.field.messages.splice(0);

      if (recursive) {
        this.field.childrenList.forEach((child) => child.clearMessages(true));
      }
    };

    this.field.getField = (path) => {
      const formatedPath = path[0] === '.' ? path.substring(1) : path;

      if (!formatedPath) {
        return this.field;
      }

      const paths = formatedPath.split('.');
      let children = this.field.children;
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

        for (const key in children) {
          if (key === currentPath) {
            foundField = children[key];

            if (match) {
              foundField = getFieldByIndex(foundField as UnknowSetField, match[2]);
            }

            if (foundField && foundField.hasChildren) {
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
