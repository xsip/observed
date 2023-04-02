import 'reflect-metadata';
import { WatcherMetadata, } from './types';
import { WatchThis } from './handler';
import { debounceOnChanges } from './helper';
const observedServices = {};
export function CheckAll() {
    return function _CheckAll(classInstance, propertyName) {
        Reflect.defineMetadata(WatcherMetadata.CHECK_ALL, [...(Reflect.getMetadata(WatcherMetadata.CHECK_ALL, classInstance) ?? []), propertyName], classInstance);
    };
}
export function OnChange(options) {
    return function _OnChange(classInstance, propertyName) {
        Reflect.defineMetadata(WatcherMetadata.ON_CHANGE, { fnKey: propertyName, stack: options?.stack }, classInstance);
    };
}
export function OnRead(options) {
    return function _OnRead(classInstance, propertyName) {
        Reflect.defineMetadata(WatcherMetadata.ON_READ, { fnKey: propertyName, stack: options.stack }, classInstance);
    };
}
export function Observed({ singleton = true }) {
    return function _logic(constructor) {
        return class extends constructor {
            constructor(...args) {
                super(...args);
                const getMeta = (key) => Reflect.getMetadata(key, this);
                if (singleton && observedServices[constructor.name]) {
                    return observedServices[constructor.name];
                }
                const onChangeMeta = getMeta(WatcherMetadata.ON_CHANGE);
                const onReadMeta = getMeta(WatcherMetadata.ON_READ);
                const onChangesRawFn = this[onChangeMeta.fnKey];
                const onReadRawFn = this[onReadMeta.fnKey];
                this.__onChanges = onChangeMeta.stack ? debounceOnChanges(onChangesRawFn, 1) : onChangesRawFn;
                this.__onRead = onReadMeta.stack ? debounceOnChanges(onReadRawFn, 1) : onReadRawFn;
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
