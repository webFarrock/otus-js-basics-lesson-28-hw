export interface CRUD<T> {
  fetchAll(): Promise<T[]>;
  fetch(id: number): Promise<T | null>;
  save(data: T): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}

export interface HasId {
  id?: number;
}
