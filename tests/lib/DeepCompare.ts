import { Objects } from '@/lib/Objects';

export function DeepCompare(o1: any, o2: any): boolean {
  if (!Objects.isObject(o1)) {
    return o1 === o2;
  }

  const keys1 = Object.keys(o1);

  if (keys1.length !== Object.keys(o2).length) {
    return false;
  }

  return !keys1.some((key) => {
    const result = !o2.hasOwnProperty(key);

    if (!result && typeof o1[key] === 'object') {
      return !DeepCompare(o1[key], o2[key]);
    }

    return o1[key] !== o2[key];
  });
}
