import { Dictionary } from '@/types';

export const Value = {
  null() {
    return null;
  },
  boolean(value: unknown) {
    return value === true;
  },
  integer(data: unknown) {
    const value = Number(data);
    const parsedValue = Number.parseInt(data as string, 10);

    return Number.isNaN(value) || Number.isNaN(parsedValue) ? undefined : parsedValue;
  },
  number(data: unknown) {
    const value = Number(data);
    const parsedValue = Number.parseFloat(data as string);

    return Number.isNaN(value) || Number.isNaN(parsedValue) ? undefined : parsedValue;
  },
  object(data: unknown): Dictionary {
    return data as any || {};
  },
  string(data: unknown) {
    return typeof data !== 'undefined' ? `${data}` : undefined;
  },
  array(data: unknown[]): unknown[] {
    return data instanceof Array
      ? data.filter((item) => typeof item !== 'undefined')
      : [];
  }
};
