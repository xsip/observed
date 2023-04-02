// / Class<{ __name: string; __id__: string; __onChanges: OnChangesFn; __onRead: OnReadFn }>;
export function debounceOnChanges(func, ms) {
    let timeout;
    const changes = [];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (...args) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const context = this;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        changes.push(...args[0]);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            // TODO: reset changes
            args[0] = changes.filter((e, i, a) => a.indexOf(e) === i);
            // eslint-disable-next-line @typescript-eslint/ban-types
            return func.apply(context, args);
        }, ms);
    };
}
