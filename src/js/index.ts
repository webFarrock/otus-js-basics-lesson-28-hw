import { LocalStorageTask } from "./LocalStorageTask";
import { JsonDbTask } from "./JsonDbTask";
import { LocalStorage } from "./Storage/LocalStorage";
import { JsonDb } from "./Storage/JsonDb";
import { entityName, rootUrl } from "./Task";


(async function () {
  await new LocalStorage(entityName).clear();
  await new JsonDb(rootUrl).clear();
})();

const lTask_1 = LocalStorageTask.buildItem({ text: "local one" });
const lTask_2 = LocalStorageTask.buildItem({ text: "local two" });

lTask_1
  .save()
  .then(() => {
    console.log("lTask_1 saved");
    return LocalStorageTask.buildCollection();
  })
  .then((res) => {
    console.log("task list: ", res);
  })
  .catch((e) => {
    console.log("error while saving lTask_1: ", e);
  });

lTask_2
  .save()
  .then(() => {
    console.log("lTask_2 saved");
    return LocalStorageTask.buildCollection();
  })
  .then((res) => {
    console.log("task list: ", res);
  })
  .catch((e) => {
    console.log("error while saving lTask_2: ", e);
  });

const jsonTask_1 = JsonDbTask.buildItem({ text: "json one" });
const jsonTask_2 = JsonDbTask.buildItem({ text: "json two" });

jsonTask_1
  .save()
  .then(() => {
    console.log("jsonTask_1 saved");
    return JsonDbTask.buildCollection();
  })
  .then((res) => {
    console.log("task list: ", res);
  })
  .catch((e) => {
    console.log("error while saving jsonTask_1: ", e);
  });

jsonTask_2
  .save()
  .then(() => {
    console.log("jsonTask_2 saved");
    return JsonDbTask.buildCollection();
  })
  .then((res) => {
    console.log("task list: ", res);
  })
  .catch((e) => {
    console.log("error while saving jsonTask_2: ", e);
  });

