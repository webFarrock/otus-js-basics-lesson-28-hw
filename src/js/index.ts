import { Task, TaskProps, TaskStatus } from "./Task";
import { StorageType } from "./Storage/StorageType";
const storageType = StorageType.jsonDb;

/*
const task = Task.buildItem(
  {
    id: 3,
    tags: ["tagOne", "tagTwoUpdated!!!"],
    date: new Date(),
    text: "Some task text+",
    status: TaskStatus.New,
  },
  storageType
);

task.delete();
*/

//const fetchedTask = Task.buildItem({ id: 2 }, storageType);
//fetchedTask.fetch().then((res) => console.log("task: ", res));
/*
console.log(fetchedTask);
fetchedTask.delete();

Task.buildCollection(storageType).then((collection) => {
  console.log(collection);
});
*/
