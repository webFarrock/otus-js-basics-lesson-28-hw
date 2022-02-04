import { CRUD, HasId } from "./Storage/StorageInterface";
import { ModelAttrs } from "./Attributes";

export class Model<T extends HasId> {
  constructor(private attrs: ModelAttrs<T>, private sync: CRUD<T>) {}

  get<K extends keyof T>(key: K): T[K] {
    return this.attrs.get(key);
  }

  set(update: T): void {
    this.attrs.set(update);
  }

  fetch(): Promise<T> {
    const id = this.get("id");

    if (typeof id !== "number") {
      return Promise.reject(new Error("Cannot fetch without an id"));
    }

    return this.sync.fetch(id);
  }

  save(): Promise<boolean> {
    return this.sync.save(this.attrs.getAll());
  }

  delete(): Promise<boolean> {
    const id = this.get("id");

    if (typeof id !== "number") {
      return Promise.reject(new Error("Cannot delete without an id"));
    }

    return this.sync.delete(id);
  }
}
