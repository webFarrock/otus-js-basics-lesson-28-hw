import { IStorage, IHasId } from "./StorageInterface";
interface iInstance {
  [index: string]: any; // ???
}

export class LocalStorage<T extends IHasId> implements IStorage<T> {
  private static instances: iInstance = {};
  private elems: T[] = [];

  constructor(private entityName: string) {
    if (LocalStorage.instances[entityName]) {
      return LocalStorage.instances[entityName];
    }
    this.elems = this.unpackFromStorage();
  }

  static getInstance(entityName: string) {
    if (!LocalStorage.instances[entityName]) {
      LocalStorage.instances[entityName] = new LocalStorage(entityName);
    }
    return LocalStorage.instances[entityName];
  }

  clear(): Promise<boolean> {
    return new Promise((resolve) => {
      this.elems = [];
      this.packToStorage();
      resolve(true);
    });
  }

  fetchAll(): Promise<T[]> {
    return new Promise((resolve) => {
      this.elems = this.unpackFromStorage();
      resolve(this.elems);
    });
  }

  fetch(id: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const idx = this.findIndexById(id);
      if (idx !== -1) {
        resolve(this.elems[idx]);
      }

      reject(null);
    });
  }

  save(data: T): Promise<number> {
    return new Promise((resolve) => {
      if (data.id) {
        const idx = this.findIndexById(data.id);
        if (idx !== -1) {
          this.elems.splice(idx, 1, data);
        } else {
          this.elems.push(data);
        }
      } else {
        data.id = this.getLastId() + 1;
        this.elems.push(data);
      }

      this.packToStorage();

      resolve(data.id);
    });
  }

  delete(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      const idx = this.findIndexById(id);
      if (idx !== -1) {
        this.elems.splice(idx, 1);
        this.packToStorage();
        resolve(true);
      }

      throw new Error(`Cant find entity with id=${id}`);
    });
  }

  private findIndexById(id: number): number {
    return this.elems.findIndex((elem: T) => elem.id === id);
  }

  private unpackFromStorage(): T[] {
    const elems = localStorage.getItem(this.entityName);
    if (elems) {
      const parsed = JSON.parse(elems);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  }

  private packToStorage(): void {
    localStorage.setItem(this.entityName, JSON.stringify(this.elems));
  }

  private getLastId(): number {
    return this.elems.reduce((acc: number, elem: T) => {
      acc = elem.id && elem.id > acc ? elem.id : acc;
      return acc;
    }, 0);
  }
}
