export declare const toObject: <T = any>(variable: T) => object;
export declare type OnChangesFn = <T = any>(changes: keyof T[]) => void;
export declare type OnReadFn = <T>(keys: keyof T[]) => void;
export interface OnChangesOptions {
    stack?: boolean;
}
export interface _OnChangesOptions<T> extends OnChangesOptions {
    fnKey: keyof T;
}
export interface OnReadOptions {
    stack?: boolean;
}
export interface _OnReadOptions<T> extends OnReadOptions {
    fnKey: keyof T;
}
export declare enum WatcherMetadata {
    ON_CHANGE = "onChange",
    CHECK_ALL = "checkAll",
    NAME = "name",
    ON_READ = "onRead",
    SELECTOR = "selector",
    TEMPLATE = "template"
}
export declare enum HandlerKeywords {
    IS_CHILD_PROXY = "isChildProxy",
    IS_PRESERVED = "isPreserved",
    THEN = "then",
    __ID__ = "__id__",
    ON_MODULE_INIT = "onModuleInit",
    ON_APP_BOOTSTRAP = "onApplicationBootstrap"
}
