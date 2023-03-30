import { OnChangesFn, OnReadFn } from './types';

type Class<I, Args extends any[] = any[]> = new (...args: Args) => I;
export type _ObservedClass<T> = T & { __name: string; __id__: string; __onChanges: OnChangesFn; __onRead: OnReadFn };
export type ObservedClass<T> = T & Record<string, any> & _ObservedClass<T>;
// / Class<{ __name: string; __id__: string; __onChanges: OnChangesFn; __onRead: OnReadFn }>;

export function debounceOnChanges<T = Function>(func: T, ms: number): T {
  let timeout: number;
  const changes: string[] = [];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (...args: Parameters<T>): T => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const context: T = this as T;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    changes.push(...args[0]);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      // TODO: reset changes
      args[0] = changes.filter((e, i, a) => a.indexOf(e) === i);
      // eslint-disable-next-line @typescript-eslint/ban-types
      return (func as any as Function).apply(context, args);
    }, ms);
  };
}
