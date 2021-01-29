// events.d.ts
interface CustomEventMap {
    'my-event:foo': {
        something: boolean
    }
    // When adding a new custom event to your code, add the event.name + event.detail type to this map!
}

// Do not change code below this line!
type CustomDelegatedEventListener<T> = (this: Element, ev: CustomEvent<T> & { currentTarget: Element }) => any

declare module 'delegated-events' {
    export function fire<K extends keyof CustomEventMap>(target: Element, name: K, detail: CustomEventMap[K]): boolean

    export function on<K extends keyof CustomEventMap>(
        name: K,
        selector: string,
        listener: CustomDelegatedEventListener<CustomEventMap[K]>
    ): void
}

interface Document {
    addEventListener<K extends keyof CustomEventMap>(
        type: K,
        listener: (this: Document, ev: CustomEvent<CustomEventMap[K]>) => unknown,
        options?: boolean | AddEventListenerOptions
    ): void
}

interface HTMLElement {
    addEventListener<K extends keyof CustomEventMap>(
        type: K,
        listener: (this: HTMLElement, ev: CustomEvent<CustomEventMap[K]>) => unknown,
        options?: boolean | AddEventListenerOptions
    ): void
}
