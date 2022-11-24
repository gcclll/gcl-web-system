const toString = Object.prototype.toString;

const isPrimeArray = Array.isArray;
const t = (val: unknown) => toString.call(val).slice(8, -1);

export const isString = (val: unknown): boolean => typeof val === 'string';
export const isPlainObject = (val: unknown): boolean => t(val) === 'Object';
export const isArray = (val: unknown): boolean =>
  isPrimeArray ? isPrimeArray(val) : t(val) === 'Array';
export const isCanvasElement = (val: unknown): boolean =>
  t(val) === 'HTMLCanvasElement';

const _hasOwn = Object.prototype.hasOwnProperty;
export const hasOwn = (o: object, prop: string | number): boolean =>
  _hasOwn.call(o, prop);
