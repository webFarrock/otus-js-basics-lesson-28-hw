import { JsonDb } from "./Storage/JsonDb";
import { LocalStorage } from "./Storage/LocalStorage";
import { IStorage } from "./Storage/StorageInterface";

import { Attributes } from "./Attributes";
import { Model } from "./Model";
import { StorageType } from "./Storage/StorageType";

export const enum TaskStatus {
  New = "New",
  Completed = "Completed",
}

export interface ITaskProps {
  id?: number;
  date?: Date;
  text?: string;
  status?: TaskStatus;
  tags?: string[];
}

export const TASK_ENTITY_NAME = "tasks";
export const TASK_ROOT_URL = `http://localhost:3000/${TASK_ENTITY_NAME}`;

export class Task extends Model<ITaskProps> {
  static buildCollection(storageType: StorageType): Promise<Task[]> {
    const storage = Task.buildStorageByType(storageType);
    if (storage === null) {
      throw new Error(`Wrong storage (${storage})`);
    }

    return storage.fetchAll().then((props) => {
      const tasksCollection: Task[] = [];
      props.forEach((attrs) => {
        tasksCollection.push(new Task(new Attributes<ITaskProps>(attrs), storage));
      });

      return tasksCollection;
    });
  }

  static buildItem(attrs: ITaskProps, storageType: StorageType): Task {
    const storage = Task.buildStorageByType(storageType);
    if (storage === null) {
      throw new Error(`Wrong storage (${storage})`);
    }

    return new Task(new Attributes<ITaskProps>(attrs), storage);
  }

  private static buildStorageByType(storageType: StorageType): IStorage<ITaskProps> | null {
    switch (storageType) {
      case StorageType.localStorage: {
        return LocalStorage.getInstance(TASK_ENTITY_NAME);
      }
      case StorageType.jsonDb: {
        return JsonDb.getInstance(TASK_ROOT_URL);
      }
    }

    return null;
  }
}
