import axios, { AxiosPromise, AxiosResponse } from "axios";
import { HasId, iStorage } from "./StorageInterface";

interface iInstance {
  [index: string]: any; // ???
}

export class JsonDb<T extends HasId> implements iStorage<T> {
  private static instances: iInstance = {};

  constructor(private rootUrl: string) {}

  static getInstance(rootUrl: string) {
    if (!JsonDb.instances[rootUrl]) {
      JsonDb.instances[rootUrl] = new JsonDb(rootUrl);
    }
    return JsonDb.instances[rootUrl];
  }

  fetch(id: number): Promise<T> {
    return axios.get(`${this.rootUrl}/${id}`).then((res: AxiosResponse) => {
      return Promise.resolve(res.data);
    });
  }

  clear(): Promise<boolean> {
    return this.fetchAll().then((elems) => {
      const deletionPromises: Promise<boolean>[] = elems.map((elem) => {
        if (elem.id) {
          return this.delete(elem.id);
        }
        return Promise.resolve(true);
      });

      return Promise.all(deletionPromises).then(() => true);
    });
  }

  save(data: T): Promise<number> {
    const id = data.id;
    if (id) {
      return axios.put(`${this.rootUrl}/${id}`, data).then(() => id);
    } else {
      return axios.post(this.rootUrl, data).then((res) => {
        if (res?.data?.id) {
          return res.data.id;
        }
        throw new Error("error while saving entity");
      });
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
