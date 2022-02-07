import { IStorage, IHasId } from "./Storage/StorageInterface";
import { ModelAttrs } from "./Attributes";

export class Model<T extends IHasId> {
  constructor(private attrs: ModelAttrs<T>, private sync: IStorage<T>) {}

  get<K extends keyof T>(key: K): T[K] {
    return this.attrs.get(key);
  }

  set(update: T): void {
    this.attrs.set(update);
  }

  fetch(): Promise<boolean> {
    const id = this.get("id");

    if (typeof id !== "number") {
      return Promise.reject(new Error("Cannot fetch without an id"));
    }

    return this.sync
      .fetch(id)
      .then((res) => {
        this.attrs.set(res);
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  async save(): Promise<number | null> {
    const id = await this.sync.save(this.attrs.getAll());
    if (id !== null) {
      this.attrs.set({ id } as T);
    }
    return Promise.resolve(id);
  }

  delete(): Promise<boolean> {
    const id = this.get("id");

    if (typeof id !== "number") {
      return Promise.reject(new Error("Cannot delete without an id"));
    }

    return this.sync.delete(id);
  }
}
