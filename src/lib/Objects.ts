import { Dictionary } from '@/types';

export const Objects = {
  isScalar(value: any) {
    if (value === null) {
      return true;
    }

    return /string|number|boolean|undefined/.test(typeof value);
  },

  equals(o1: any, o2: any) {
    if (Objects.isScalar(o1)) {
      return o1 === o2;
    }

    const keys1 = Object.keys(o1);

    if (keys1.length !== Object.keys(o2).length) {
      return false;
    }

    return !keys1.some((key) => !o2.hasOwnProperty(key) || o1[key] !== o2[key]);
  },

  assign<T extends Dictionary = Dictionary<any>>(dest: any, src: T): T {
    Object.keys(src).forEach((key) => {
      const value = src[key];

      if (Objects.isScalar(value)) {
        dest[key] = value;
      } else if (value instanceof Array) {
        dest[key] = [ ...value ];
      } else if (typeof value === 'function') {
        dest[key] = value;
      } else {
        if (!dest[key]) {
          dest[key] = {};
        }

        Objects.assign(dest[key] as any, value as any);
      }
    });

    return dest;
  },

  clone<T extends Dictionary = Dictionary<any>>(object: T): T {
    return Objects.assign<T>({} as any, object);
  },

  clear<T extends Dictionary = Dictionary<any>>(object: T) {
    for (const key in object) {
      delete object[key];
    }
  },

  isEmpty<T extends Dictionary = Dictionary<any>>(object: T) {
    for (const key in object) {
      return false;
    }

    return true;
  }
};
