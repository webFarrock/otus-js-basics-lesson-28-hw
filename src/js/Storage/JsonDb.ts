import axios, { AxiosPromise, AxiosResponse } from "axios";
import { HasId, CRUD } from "./StorageInterface";

export class JsonDb<T extends HasId> implements CRUD<T> {
  constructor(private rootUrl: string) {}

  fetch(id: number): Promise<T> {
    return axios.get(`${this.rootUrl}/${id}`).then((res: AxiosResponse) => {
      return Promise.resolve(res.data);
    });
  }

  save(data: T): Promise<boolean> {
    const id = data.id;
    if (id) {
      return axios.put(`${this.rootUrl}/${id}`, data).then(() => true);
    } else {
      return axios.post(this.rootUrl, data).then(() => true);
    }
  }

  delete(id: number): Promise<boolean> {
    return axios.delete(`${this.rootUrl}/${id}`).then(() => {
      return true;
    });
  }

  fetchAll(): Promise<T[]> {
    return axios.get(this.rootUrl).then((res: AxiosResponse): Promise<T[]> => {
      const elems = Array.isArray(res.data) ? res.data : [];
      return Promise.resolve(elems);
    });
  }
}
