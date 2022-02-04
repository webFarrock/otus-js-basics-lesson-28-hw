import { Task, TaskProps, TaskStatus } from "./Task";
import { StorageType } from "./Storage/StorageType";
const storageType = StorageType.localStorage;
const task = Task.buildItem(
  {
    id: 3,
    tags: ["tagOne", "tagTwoUpdated+"],
    date: new Date(),
    text: "Some task text+",
    status: TaskStatus.New,
  },
  storageType
);

task.save();

const fetchedTask = Task.buildItem({ id: 3 }, storageType);
fetchedTask.fetch();
console.log(fetchedTask);

Task.buildCollection(storageType).then((collection) => {
  console.log(collection);
});
