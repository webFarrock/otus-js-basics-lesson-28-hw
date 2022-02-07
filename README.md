# Домашнее задание курса [OTUS JS Basics](https://otus.ru/lessons/javascript-basic/) - Разработка собственного API

## Основные команды
### Build
```js
npm run build
```

### Dev
```js
npm run dev
```
### Linter
```js
npm run lint
```
### Test
```js
npm run test
```
### Test Coverage
```js
npm run test:coverage
```

### Run json database server
```js
npm run db-server
```



## Settings
```js
import { TASK_ENTITY_NAME, TASK_ROOT_URL } from "./Task";
// TASK_ENTITY_NAME - name for localStorage item where tasks sotre = tasks
// TASK_ROOT_URL - url for json database api tasks = `http://localhost:3000/${TASK_ENTITY_NAME}`

```
## Examples
### LocalStorage
```js
// create task
const tast = LocalStorageTask.buildItem({ text: "local one" });

// save task
await task.save(); // task will get id after save

// update task
task.set({text: "local one updated"});
await task.save();

// delete task
await task.delete();

// fetch all tasks from localstorage
const allTasks = await LocalStorageTask.buildCollection();

// clear storage
await new LocalStorage(TASK_ENTITY_NAME).clear();
```

### JsonDB
```js
// create task
const tast = JsonDb.buildItem({ text: "local one" });

// save task
await task.save(); // task will get id after save

// update task
task.set({text: "local one updated"});
await task.save();

// delete task
await task.delete();

// fetch all tasks from localstorage
const allTasks = await JsonDb.buildCollection();

// clear storage
await new JsonDb(TASK_ENTITY_NAME).clear();
```

