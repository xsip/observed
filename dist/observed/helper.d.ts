import { OnChangesFn, OnReadFn } from './types';
export declare type _ObservedClass<T> = T & {
    __name: string;
    __id__: string;
    __onChanges: OnChangesFn;
    __onRead: OnReadFn;
};
export declare type ObservedClass<T> = T & Record<string, any> & _ObservedClass<T>;
export declare function debounceOnChanges<T = Function>(func: T, ms: number): T;
