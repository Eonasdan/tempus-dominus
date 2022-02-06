export declare type Constructable<T> = new (...args: any[]) => T;
declare class ServiceLocator {
    private cache;
    locate<T>(identifier: Constructable<T>): T;
}
export declare const setupServiceLocator: () => void;
export declare let serviceLocator: ServiceLocator;
export {};
