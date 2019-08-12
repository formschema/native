import { Dict } from '@/types';

export const Objects = {
  isObject(value: unknown) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  },

  assign<T extends Dict = Dict<any>>(dest: any, src: T): T {
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

  clone<T extends Dict = Dict<any>>(object: T): T {
    return Objects.assign<T>({}, object);
  },

  isEmpty<T extends Dict = Dict<any>>(object: T) {
    for (const key in object) {
      return false;
    }

    return true;
  },

  clear<T extends Dict = Dict<any>>(object: T) {
    for (const key in object) {
      delete object[key];
    }
  }
};
