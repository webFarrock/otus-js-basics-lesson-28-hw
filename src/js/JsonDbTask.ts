import { Task, ITaskProps } from "./Task";
import { StorageType } from "./Storage/StorageType";

export class JsonDbTask {
  static buildItem(attrs: ITaskProps): Task {
    return Task.buildItem(attrs, StorageType.jsonDb);
  }

  static buildCollection(): Promise<Task[]> {
    return Task.buildCollection(StorageType.jsonDb);
  }
}
