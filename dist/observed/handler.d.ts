import { OnChangesFn, OnReadFn } from './types';
export declare function WatchThis<T extends object>(classToWatch: T, onChanges: OnChangesFn, onReadAccess: OnReadFn, isChildProxy?: boolean, prependPath?: string): T;
