import { Task, ITaskProps } from "./Task";
import { StorageType } from "./Storage/StorageType";

export class LocalStorageTask {
  static buildItem(attrs: ITaskProps): Task {
    return Task.buildItem(attrs, StorageType.localStorage);
  }

  static buildCollection(): Promise<Task[]> {
    return Task.buildCollection(StorageType.localStorage);
  }
}
