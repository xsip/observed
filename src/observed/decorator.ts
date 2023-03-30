import 'reflect-metadata';

import {
  _OnChangesOptions,
  _OnReadOptions,
  OnChangesFn,
  OnChangesOptions,
  OnReadFn,
  OnReadOptions,
  WatcherMetadata,
} from './types';
import { WatchThis } from './handler';
import { debounceOnChanges, ObservedClass } from './helper';

const observedServices: Record<string, any> = {};

interface ObservedOptions {
  singleton?: boolean;
}

export function CheckAll() {
  return function _CheckAll<T>(classInstance: ObservedClass<T>, propertyName: string) {
    Reflect.defineMetadata(
      WatcherMetadata.CHECK_ALL,
      [...(Reflect.getMetadata(WatcherMetadata.CHECK_ALL, classInstance) ?? []), propertyName],
      classInstance
    );
  };
}

export function OnChange(options?: OnChangesOptions) {
  return function _OnChange<T>(classInstance: T, propertyName: string) {
    Reflect.defineMetadata(
      WatcherMetadata.ON_CHANGE,
      { fnKey: propertyName, stack: options?.stack },
      classInstance as ObservedClass<T>
    );
  };
}

export function OnRead(options: OnReadOptions) {
  return function _OnRead<T>(classInstance: T, propertyName: string) {
    Reflect.defineMetadata(
      WatcherMetadata.ON_READ,
      { fnKey: propertyName, stack: options.stack },
      classInstance as ObservedClass<T>
    );
  };
}

export function Observed({ singleton = true }: ObservedOptions) {
  return function _logic<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      __onChanges!: OnChangesFn;
      __onRead!: OnReadFn;

      constructor(...args: any[]) {
        super(...args);

        const getMeta = (key: WatcherMetadata) => Reflect.getMetadata(key, this);

        if (singleton && observedServices[constructor.name]) {
          return observedServices[constructor.name];
        }
        const onChangeMeta: _OnChangesOptions<typeof this> = getMeta(WatcherMetadata.ON_CHANGE);
        const onReadMeta: _OnReadOptions<typeof this> = getMeta(WatcherMetadata.ON_READ);

        const onChangesRawFn: OnChangesFn = this[onChangeMeta.fnKey] as OnChangesFn;
        const onReadRawFn: OnReadFn = this[onReadMeta.fnKey] as OnReadFn;

        this.__onChanges = onChangeMeta.stack ? debounceOnChanges(onChangesRawFn, 1) : onChangesRawFn;
        this.__onRead = onReadMeta.stack ? debounceOnChanges<OnReadFn>(onReadRawFn, 1) : onReadRawFn;

        const watched = WatchThis(this, this.__onChanges, this.__onRead);
        Reflect.defineMetadata(WatcherMetadata.NAME, constructor.name, watched);

        if (singleton) {
          observedServices[constructor.name] = watched;
          return observedServices[constructor.name];
        }

        return watched;
      }
    };
  };
}
