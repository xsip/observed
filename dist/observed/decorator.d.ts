import 'reflect-metadata';
import { OnChangesFn, OnChangesOptions, OnReadFn, OnReadOptions } from './types';
import { ObservedClass } from './helper';
interface ObservedOptions {
    singleton?: boolean;
}
export declare function CheckAll(): <T>(classInstance: ObservedClass<T>, propertyName: string) => void;
export declare function OnChange(options?: OnChangesOptions): <T>(classInstance: T, propertyName: string) => void;
export declare function OnRead(options: OnReadOptions): <T>(classInstance: T, propertyName: string) => void;
export declare function Observed({ singleton }: ObservedOptions): <T extends new (...args: any[]) => {}>(constructor: T) => {
    new (...args: any[]): {
        __onChanges: OnChangesFn;
        __onRead: OnReadFn;
    };
} & T;
export {};
