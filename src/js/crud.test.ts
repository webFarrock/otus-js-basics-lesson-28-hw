import axios, { AxiosResponse } from "axios";
import { LocalStorage } from "./Storage/LocalStorage";
import { TASK_ENTITY_NAME, TaskStatus } from "./Task";
import { LocalStorageTask } from "./LocalStorageTask";
import { JsonDbTask } from "./JsonDbTask";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedPostResponse: AxiosResponse = {
  data: { id: 1 },
  status: 200,
  statusText: "OK",
  headers: {},
  config: {},
};
mockedAxios.post.mockResolvedValue(mockedPostResponse);

const mockedPutResponse: AxiosResponse = {
  data: {},
  status: 200,
  statusText: "OK",
  headers: {},
  config: {},
};
mockedAxios.put.mockResolvedValue(mockedPutResponse);

describe("api with JsonDbTask", () => {
  it("create task", async () => {
    const taskAttrs = {
      text: "text for task one",
      date: new Date(100500),
      tags: ["tag_one", "tag_two"],
      status: TaskStatus.New,
    };
    const task = JsonDbTask.buildItem(taskAttrs);

    expect(task.get("id")).toBeUndefined();
    await task.save();
    expect(task.get("id")).toBeTruthy();

    const mockedResponse: AxiosResponse = {
      data: Object.assign({ id: task.get("id") }, taskAttrs),
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    };
    mockedAxios.get.mockResolvedValue(mockedResponse);

    const taskToBeFetched = JsonDbTask.buildItem({ id: task.get("id") });
    const isFound = await taskToBeFetched.fetch();
    expect(isFound).toBeTruthy();

    expect(taskToBeFetched.get("text")).toEqual(task.get("text"));
    expect(taskToBeFetched.get("status")).toEqual(task.get("status"));
    expect(+(taskToBeFetched.get("date") as Date)).toEqual(+(task.get("date") as Date));
    expect((taskToBeFetched.get("tags") as string[]).join("")).toEqual((task.get("tags") as string[]).join(""));
  });

  it("fetch non exists task", async () => {
    const mockedResponse: AxiosResponse = {
      data: null,
      status: 404,
      statusText: "",
      headers: {},
      config: {},
    };
    mockedAxios.get.mockRejectedValue(mockedResponse);

    const fakeId = 999;
    const taskToBeFetched = JsonDbTask.buildItem({ id: fakeId });
    const isFound = await taskToBeFetched.fetch();

    expect(isFound).toBeFalsy();
    expect(taskToBeFetched.get("text")).toBeUndefined();
    expect(taskToBeFetched.get("status")).toBeUndefined();
    expect(taskToBeFetched.get("date")).toBeUndefined();
    expect(taskToBeFetched.get("tags")).toBeUndefined();
  });

  it("delete existing task", async () => {
    const taskAttrs = {
      text: "text for task one",
      date: new Date(100500),
      tags: ["tag_one", "tag_two"],
      status: TaskStatus.New,
    };
    const task = JsonDbTask.buildItem(taskAttrs);

    const mockedSaveResponse: AxiosResponse = {
      data: Object.assign({ id: task.get("id") }, taskAttrs),
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    };
    mockedAxios.get.mockResolvedValue(mockedSaveResponse);
    expect(task.get("id")).toBeUndefined();
    await task.save();
    expect(task.get("id")).toBeTruthy();

    const mockedDeleteResponse: AxiosResponse = {
      data: {},
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    };
    mockedAxios.delete.mockResolvedValue(mockedDeleteResponse);

    const isDeleted = await task.delete();
    expect(isDeleted).toBeTruthy();

    const mockedResponse: AxiosResponse = {
      data: null,
      status: 404,
      statusText: "",
      headers: {},
      config: {},
    };
    mockedAxios.get.mockRejectedValue(mockedResponse);

    const taskToBeFetched = JsonDbTask.buildItem({ id: task.get("id") });
    const isFound = await taskToBeFetched.fetch();
    expect(isFound).toBeFalsy();
  });

  it("delete non existing task", async () => {
    const fakeId = 999;
    const task = JsonDbTask.buildItem({ id: fakeId });
    const mockedResponse: AxiosResponse = {
      data: null,
      status: 404,
      statusText: "",
      headers: {},
      config: {},
    };
    mockedAxios.delete.mockRejectedValue(mockedResponse);
    await expect(task.delete()).rejects.toThrowError();
  });

  it("delete non saved task", async () => {
    const task = JsonDbTask.buildItem({});
    await expect(task.delete()).rejects.toThrowError();
  });

  it("update task", async () => {
    const taskAttrs = {
      text: "text for task one",
      date: new Date(100500),
      tags: ["tag_one", "tag_two"],
      status: TaskStatus.New,
    };
    const task = JsonDbTask.buildItem(taskAttrs);

    await task.save();
    const taskToBeUpdated = JsonDbTask.buildItem({ id: task.get("id") });

    const newText = "updated text for task one";
    const newStatus = TaskStatus.Completed;
    const newTag = "tag_for_updated_task";
    const newDate = new Date(789987);

    taskToBeUpdated.set({
      text: newText,
      date: newDate,
      tags: [newTag],
      status: newStatus,
    });
    await taskToBeUpdated.save();

    expect(taskToBeUpdated.get("id")).toEqual(task.get("id"));
    expect(taskToBeUpdated.get("text") as string).toEqual(newText);
    expect(+(taskToBeUpdated.get("date") as Date)).toEqual(+newDate);
    expect((taskToBeUpdated.get("tags") as string[]).join("")).toEqual([newTag].join(""));
    expect(taskToBeUpdated.get("status") as TaskStatus).toEqual(newStatus);
  });

  it("fetch all", async () => {
    const taskOneAttrs = {
      text: "text for task one",
      date: new Date(100500),
      tags: ["tag_one", "tag_two"],
      status: TaskStatus.New,
    };
    const taskOne = JsonDbTask.buildItem(taskOneAttrs);

    const taskTwoAttrs = {
      text: "text for task two",
      date: new Date(200500),
      tags: ["tag_one2", "tag_two2"],
      status: TaskStatus.Completed,
    };
    const taskTwo = JsonDbTask.buildItem(taskOneAttrs);

    const notSavedTask = LocalStorageTask.buildItem({
      text: "text for task three",
      date: new Date(300500),
      tags: ["tag_one3", "tag_two3"],
      status: TaskStatus.Completed,
    });

    const mockedSaveResponse: AxiosResponse = {
      data: [taskOneAttrs, taskTwoAttrs],
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    };
    mockedAxios.get.mockResolvedValue(mockedSaveResponse);

    const taskCollection = await JsonDbTask.buildCollection();

    expect(taskCollection).toHaveLength(2);
    expect(taskCollection.find((item) => item.get("text") === taskOne.get("text"))).toBeTruthy();
    expect(taskCollection.find((item) => item.get("text") === taskTwo.get("text"))).toBeTruthy();
    expect(taskCollection.find((item) => item.get("text") === notSavedTask.get("text"))).toBeFalsy();
  });
});

describe("api with LocalStorage", () => {
  beforeEach(async () => {
    await LocalStorage.getInstance(TASK_ENTITY_NAME).clear();
  });

  it("create task", async () => {
    const task = LocalStorageTask.buildItem({
      text: "text for task one",
      date: new Date(100500),
      tags: ["tag_one", "tag_two"],
      status: TaskStatus.New,
    });

    expect(task.get("id")).toBeUndefined();
    await task.save();
    expect(task.get("id")).toBeTruthy();

    const taskToBeFetched = LocalStorageTask.buildItem({ id: task.get("id") });

    const isFound = await taskToBeFetched.fetch();
    expect(isFound).toBeTruthy();

    expect(taskToBeFetched.get("text")).toEqual(task.get("text"));
    expect(taskToBeFetched.get("status")).toEqual(task.get("status"));
    expect(+(taskToBeFetched.get("date") as Date)).toEqual(+(task.get("date") as Date));
    expect((taskToBeFetched.get("tags") as string[]).join("")).toEqual((task.get("tags") as string[]).join(""));
  });

  it("fetch non exists task", async () => {
    const fakeId = 999;
    const taskToBeFetched = LocalStorageTask.buildItem({ id: fakeId });
    const isFound = await taskToBeFetched.fetch();

    expect(isFound).toBeFalsy();
    expect(taskToBeFetched.get("text")).toBeUndefined();
    expect(taskToBeFetched.get("status")).toBeUndefined();
    expect(taskToBeFetched.get("date")).toBeUndefined();
    expect(taskToBeFetched.get("tags")).toBeUndefined();
  });

  it("delete existing task", async () => {
    const task = LocalStorageTask.buildItem({
      text: "text for task one",
      date: new Date(100500),
      tags: ["tag_one", "tag_two"],
      status: TaskStatus.New,
    });

    expect(task.get("id")).toBeUndefined();
    await task.save();
    expect(task.get("id")).toBeTruthy();

    const isDeleted = await task.delete();
    expect(isDeleted).toBeTruthy();

    const taskToBeFetched = LocalStorageTask.buildItem({ id: task.get("id") });
    const isFound = await taskToBeFetched.fetch();
    expect(isFound).toBeFalsy();
  });

  it("delete non existing task", async () => {
    const fakeId = 999;
    const task = LocalStorageTask.buildItem({ id: fakeId });
    await expect(task.delete()).rejects.toThrowError();
  });

  it("delete non saved task", async () => {
    const task = LocalStorageTask.buildItem({});
    await expect(task.delete()).rejects.toThrowError();
  });

  it("update task", async () => {
    const task = LocalStorageTask.buildItem({
      text: "text for task one",
      date: new Date(100500),
      tags: ["tag_one", "tag_two"],
      status: TaskStatus.New,
    });

    await task.save();
    const taskToBeUpdated = LocalStorageTask.buildItem({ id: task.get("id") });

    const newText = "updated text for task one";
    const newStatus = TaskStatus.Completed;
    const newTag = "tag_for_updated_task";
    const newDate = new Date(789987);

    taskToBeUpdated.set({
      text: newText,
      date: newDate,
      tags: [newTag],
      status: newStatus,
    });
    await taskToBeUpdated.save();

    expect(taskToBeUpdated.get("id")).toEqual(task.get("id"));
    expect(taskToBeUpdated.get("text") as string).toEqual(newText);
    expect(+(taskToBeUpdated.get("date") as Date)).toEqual(+newDate);
    expect((taskToBeUpdated.get("tags") as string[]).join("")).toEqual([newTag].join(""));
    expect(taskToBeUpdated.get("status") as TaskStatus).toEqual(newStatus);
  });

  it("fetch all created task", async () => {
    const taskOne = LocalStorageTask.buildItem({
      text: "text for task one",
      date: new Date(100500),
      tags: ["tag_one", "tag_two"],
      status: TaskStatus.New,
    });
    await taskOne.save();

    const taskTwo = LocalStorageTask.buildItem({
      text: "text for task two",
      date: new Date(200500),
      tags: ["tag_one2", "tag_two2"],
      status: TaskStatus.Completed,
    });
    await taskTwo.save();

    const notSavedTask = LocalStorageTask.buildItem({
      text: "text for task three",
      date: new Date(300500),
      tags: ["tag_one3", "tag_two3"],
      status: TaskStatus.Completed,
    });

    const taskCollection = await LocalStorageTask.buildCollection();

    expect(taskCollection).toHaveLength(2);
    expect(taskCollection.find((item) => item.get("text") === taskOne.get("text"))).toBeTruthy();
    expect(taskCollection.find((item) => item.get("text") === taskTwo.get("text"))).toBeTruthy();
    expect(taskCollection.find((item) => item.get("text") === notSavedTask.get("text"))).toBeFalsy();
  });
});
