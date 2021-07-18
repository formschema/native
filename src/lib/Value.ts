import { Dict } from '../../types';
import { JsonSchema } from '../../types/jsonschema';

export const Value = {
  parseValue(data: unknown, { type }: JsonSchema): unknown {
    if (this.hasOwnProperty(type)) {
      if (type === 'boolean' && typeof data === 'string') {
        data = data === 'true';
      }

      return (Value as any)[type](data);
    }

    return data as any;
  },
  null(): null {
    return null;
  },
  boolean(value: unknown): boolean {
    return value === true;
  },
  integer(data: unknown): number | undefined {
    const value = Number(data);
    const parsedValue = Number.parseInt(data as string, 10);

    return Number.isNaN(value) || Number.isNaN(parsedValue) ? undefined : parsedValue;
  },
  number(data: unknown): number | undefined {
    const value = Number(data);
    const parsedValue = Number.parseFloat(data as string);

    return Number.isNaN(value) || Number.isNaN(parsedValue) ? undefined : parsedValue;
  },
  object(data: unknown): Dict {
    return data as any || {};
  },
  string(data: unknown): string | undefined {
    return typeof data !== 'undefined' ? `${data}` : undefined;
  },
  array(data: unknown[]): unknown[] {
    return data instanceof Array
      ? data.filter((item) => typeof item !== 'undefined')
      : [];
  }
};
