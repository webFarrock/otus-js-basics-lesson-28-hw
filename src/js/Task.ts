import { JsonDb } from "./Storage/JsonDb";
import { LocalStorage } from "./Storage/LocalStorage";
import { CRUD } from "./Storage/StorageInterface";

import { Attributes } from "./Attributes";
import { Model } from "./Model";
import { StorageType } from "./Storage/StorageType";

export const enum TaskStatus {
  New = "New",
  Completed = "Completed",
}

export interface TaskProps {
  id?: number;
  date?: Date;
  text?: string;
  status?: string; // todo enum
  tags?: string[];
}

const entityName = "tasks";
const rootUrl = `http://localhost:3000/${entityName}`;

export class Task extends Model<TaskProps> {
  static buildCollection(storageType: StorageType): Promise<Task[]> {
    const storage = Task.buildStorageByType(storageType);
    if (storage === null) {
      throw new Error(`Wrong storage (${storage})`);
    }

    return storage.fetchAll().then((props) => {
      const tasksCollection: Task[] = [];
      props.forEach((attrs) => {
        tasksCollection.push(new Task(new Attributes<TaskProps>(attrs), storage));
      });

      return tasksCollection;
    });
  }

  static buildItem(attrs: TaskProps, storageType: StorageType): Task {
    const storage = Task.buildStorageByType(storageType);
    if (storage === null) {
      throw new Error(`Wrong storage (${storage})`);
    }

    return new Task(new Attributes<TaskProps>(attrs), storage);
  }

  private static buildStorageByType(storageType: StorageType): CRUD<TaskProps> | null {
    switch (storageType) {
      case StorageType.localStorage: {
        return new LocalStorage(entityName);
        break;
      }
      case StorageType.jsonDb: {
        return new JsonDb(rootUrl);
        break;
      }
    }

    return null;
  }
}
