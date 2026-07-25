import { describe, it, expect, beforeEach } from "vitest";
import { yoga } from "../src/graphql/yoga";
import prisma from "../src/utils/prisma.js";

describe("addTask mutation", () => {
  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.taskList.deleteMany();
  });

  it("creates a task when given a valid title and existing task list", async () => {
    const taskList = await prisma.taskList.create({
      data: {
        name: "Work Tasks",
      },
    });

    const mutation = `
    mutation {
      addTask(
        title: "Write documentation"
        taskListId: "${taskList.id}"
      ) {
        id
        title
        completed
        taskList {
          id
        }
      }
    }
  `;

    const response = await yoga.fetch("http://localhost/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: mutation,
      }),
    });

    const result = await response.json();

    expect(result.errors).toBeUndefined();

    expect(result.data.addTask).toMatchObject({
      title: "Write documentation",
      taskList: {
        id: taskList.id,
      },
    });

    const savedTask = await prisma.task.findUnique({
      where: {
        id: result.data.addTask.id,
      },
    });

    expect(savedTask).not.toBeNull();

    expect(savedTask?.title).toBe("Write documentation");

    expect(savedTask?.taskListId).toBe(taskList.id);
  });

  it("returns NOT_FOUND when task list does not exist", async () => {
    const mutation = `
    mutation {
      addTask(
        title: "Write documentation"
        taskListId: "cmxxxxxxxxxxxxxxxxxxxxxx"
      ) {
        id
        title
      }
    }
  `;

    const response = await yoga.fetch("http://localhost/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: mutation,
      }),
    });

    const result = await response.json();

    expect(result.errors).toBeDefined();

    expect(result.errors[0].message).toBe("Task list not found");

    expect(result.errors[0].extensions.code).toBe("NOT_FOUND");
  });

  it("returns BAD_USER_INPUT when title is too short", async () => {
    const taskList = await prisma.taskList.create({
      data: {
        name: "Work Tasks",
      },
    });

    const mutation = `
    mutation {
      addTask(
        title: "ab"
        taskListId: "${taskList.id}"
      ) {
        id
        title
      }
    }
  `;

    const response = await yoga.fetch("http://localhost/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: mutation,
      }),
    });

    const result = await response.json();

    expect(result.errors).toBeDefined();

    expect(result.errors[0].message).toBe(
      "Task title must be at least 3 characters",
    );

    expect(result.errors[0].extensions.code).toBe("BAD_USER_INPUT");
  });

  it("returns BAD_USER_INPUT when taskListId is invalid", async () => {
    const mutation = `
    mutation {
      addTask(
        title: "Write documentation"
        taskListId: "invalid-id"
      ) {
        id
        title
      }
    }
  `;

    const response = await yoga.fetch("http://localhost/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: mutation,
      }),
    });

    const result = await response.json();

    expect(result.errors).toBeDefined();

    expect(result.errors[0].message).toBe("taskListId must be a valid CUID");

    expect(result.errors[0].extensions.code).toBe("BAD_USER_INPUT");
  });
});
