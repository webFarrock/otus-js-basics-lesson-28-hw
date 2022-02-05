export interface IStorage<T> {
  clear(): Promise<boolean>;
  fetchAll(): Promise<T[]>;
  fetch(id: number): Promise<T>;
  save(data: T): Promise<number>;
  delete(id: number): Promise<boolean>;
}

export interface IHasId {
  id?: number;
}
