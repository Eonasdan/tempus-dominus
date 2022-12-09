//eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare type Constructable<T> = new (...args: any[]) => T;

class ServiceLocator {
  private cache: Map<Constructable<unknown>, unknown | symbol> = new Map();

  locate<T>(identifier: Constructable<T>): T {
    const service = this.cache.get(identifier);
    if (service) return service as T;
    const value = new identifier();
    this.cache.set(identifier, value);
    return value;
  }
}
export const setupServiceLocator = () => {
  serviceLocator = new ServiceLocator();
};

export let serviceLocator: ServiceLocator;
