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

  fetch(): void {
    const id = this.get("id");

    if (typeof id !== "number") {
      throw new Error("Cannot fetch without an id");
    }

    this.sync
      .fetch(id)
      .then((res): void => {
        if (res === null) {
          console.log(`cant find entity with id=${id}`);
          return;
        }
        this.set(res);
      })
      .catch((e) => {
        console.log(`error while fetching entity with id=${id}`);
      });
  }

  save(): void {
    this.sync
      .save(this.attrs.getAll())
      .then((): void => {
        console.log("data saved");
      })
      .catch((e) => {
        console.log("error while save: ", e);
      });
  }

  delete(): void {
    const id = this.get("id");

    if (typeof id !== "number") {
      throw new Error("Cannot delete without an id");
    }

    this.sync
      .delete(id)
      .then((res): void => {
        if (res) {
          console.log("element deleted");
          return;
        }

        console.log(`cant delete element with id=${id}`);
      })
      .catch((e) => {
        console.log(`error while deleting entity with id=${id}`);
      });
  }
}
