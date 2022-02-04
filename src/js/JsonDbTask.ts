import { Task, TaskProps } from "./Task";
import { StorageType } from "./Storage/StorageType";

export class JsonDbTask {
  static buildItem(attrs: TaskProps): Task {
    return Task.buildItem(attrs, StorageType.jsonDb);
  }

  static buildCollection(): Promise<Task[]> {
    return Task.buildCollection(StorageType.jsonDb);
  }
}
