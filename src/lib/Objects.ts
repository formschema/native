import { Dictionary } from '@/types';

export const Objects = {
  isObject(value: unknown) {
    return value !== null && typeof value === 'object';
  },

  assign<T extends Dictionary = Dictionary<any>>(dest: any, src: T): T {
    Object.keys(src).forEach((key) => {
      const value = src[key];

      if (!Objects.isObject(value) || typeof value === 'function') {
        dest[key] = value;
      } else if (value instanceof Array) {
        dest[key] = [ ...value ];
      } else {
        if (!dest[key]) {
          dest[key] = {};
        }

        Objects.assign(dest[key], value as any);
      }
    });

    return dest;
  },

  clone<T extends Dictionary = Dictionary<any>>(object: T): T {
    return Objects.assign<T>({}, object);
  },

  isEmpty<T extends Dictionary = Dictionary<any>>(object: T) {
    for (const key in object) {
      return false;
    }

    return true;
  }
};
