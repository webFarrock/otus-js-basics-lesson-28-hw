import axios, { AxiosPromise, AxiosResponse } from "axios";
import { HasId, CRUD } from "./StorageInterface";

export class JsonDb<T extends HasId> implements CRUD<T> {
  constructor(private rootUrl: string) {}

  fetch(id: number): Promise<T | null> {
    return axios.get(`${this.rootUrl}/${id}`).then((res: AxiosResponse) => {
      return Promise.resolve(null); // todo
    });
  }

  save(data: T): Promise<boolean> {
    const id = data.id;
    if (id) {
      return axios.put(`${this.rootUrl}/${id}`, data);
    } else {
      return axios.post(this.rootUrl, data);
    }
  }

  delete(id: number): Promise<boolean> {
    return Promise.resolve(false);
  }

  fetchAll(): Promise<T[]> {
    return Promise.resolve([]);
  }
}
