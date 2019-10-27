import { Dict } from '@/types';

export const Objects = {
  isObject(value: unknown) {
    return Objects.isGenericObject(value) && !Array.isArray(value);
  },

  isGenericObject(value: unknown) {
    return value !== null && typeof value === 'object';
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

  clone(value: any) {
    if (Objects.isObject(value)) {
      const object = value instanceof Array ? [] : {};

      return Objects.assign(object, value as any);
    }

    return value;
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
  },

  assignProperties(...objects: Record<string, any>[]) {
    const result: Record<string, any> = {};

    objects.reverse().forEach((object) => {
      for (const key in object) {
        if (result.hasOwnProperty(key)) {
          continue;
        }

        const descriptor = Object.getOwnPropertyDescriptor(object, key);

        if (descriptor) {
          Object.defineProperty(result, key, descriptor);
        } else {
          result[key] = undefined;
        }
      }
    });

    return result;
  }
};
