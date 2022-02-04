import { Task, TaskProps } from "./Task";
import { StorageType } from "./Storage/StorageType";

export class LocalStorageTask {
  static buildItem(attrs: TaskProps): Task {
    return Task.buildItem(attrs, StorageType.localStorage);
  }

  static buildCollection(): Promise<Task[]> {
    return Task.buildCollection(StorageType.localStorage);
  }
}
