import { Constructable } from '../../src/js/utilities/service-locator';

export declare type MockLoad = { [key: string]: Constructable<any> };

export class FixtureServiceLocator {
  private cache: Map<string, unknown | symbol> = new Map();

  locate<T>(identifier: Constructable<T>): T {
    const service = this.cache.get(identifier.name);
    if (service) return service as T;
    throw `${identifier.name} Not Mocked`;
  }

  load(name: string, service: Constructable<any>) {
    this.cache.set(name, new service());
  }

  loadEach(toLoad: MockLoad) {
    Object.entries(toLoad).forEach(([k, v]) => {
      this.load(k, v);
    });
  }
}
