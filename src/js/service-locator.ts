export declare type Constructable<T> = new (...args: any[]) => T;

export class ServiceLocator {
  private static cache: Map<Constructable<unknown>, unknown | Symbol> = new Map();

  static locate<T>(identifier: Constructable<T>): T {
    const service = this.cache.get(identifier);
    if (service) return service as T;
    const value = new identifier();
    this.cache.set(identifier, value);
    return value;
  }
}