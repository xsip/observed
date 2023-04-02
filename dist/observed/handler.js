import { HandlerKeywords, toObject } from './types';
class ChangeDetectionHandler {
    constructor(onChanges, onReadAccess, isChildProxy, prependPath) {
        this.onChanges = onChanges;
        this.onReadAccess = onReadAccess;
        this.isChildProxy = isChildProxy;
        this.prependPath = prependPath;
        return this;
    }
    buildPropertyChangePath(property) {
        return this.prependPath ? this.prependPath + '.' + property : property;
    }
    isPreserved(propertyName) {
        return Object.keys(HandlerKeywords).find((key) => HandlerKeywords[key] === propertyName ||
            propertyName?.includes(HandlerKeywords[key]));
    }
    get(instance, instanceProperty) {
        if (this.isPreserved(instanceProperty)) {
            return instance[instanceProperty];
        }
        const propValue = instance[instanceProperty];
        this.onReadAccess([this.buildPropertyChangePath(instanceProperty)]);
        if (typeof propValue === 'object' && !propValue.isChildProxy) {
            return WatchThis(instance[instanceProperty], this.onChanges.bind(instance), this.onReadAccess.bind(instance), true, `${this.prependPath ? this.prependPath + '.' : ''}${instanceProperty}`);
        }
        if (typeof instance[instanceProperty] === 'function') {
            instance[instanceProperty] = instance[instanceProperty].bind(instance);
        }
        return instance[instanceProperty];
    }
    set(instance, instanceProperty, value) {
        this.latestInstance = instance;
        instance[instanceProperty] = value;
        if (typeof value === 'object' && !value.isChildProxy) {
            instance[instanceProperty] = WatchThis(value, this.onChanges.bind(instance), this.onReadAccess.bind(instance), true, `${this.prependPath ? this.prependPath + '.' : ''}${instanceProperty}`);
        }
        if (this.isPreserved(instanceProperty)) {
            return false;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // this.latestInstance.__setLatestUpdates([this.buildNotificationPath(instanceProperty)] as any as keyof T[]);
        this.onChanges([this.buildPropertyChangePath(instanceProperty)]);
        return true;
    }
}
export function WatchThis(classToWatch, onChanges, onReadAccess, isChildProxy, prependPath) {
    return new Proxy(toObject(classToWatch), new ChangeDetectionHandler(onChanges, onReadAccess, isChildProxy, prependPath));
}
