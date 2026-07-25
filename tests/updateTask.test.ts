import { describe, it, expect, beforeEach } from "vitest";
import { yoga } from "../src/graphql/yoga";
import prisma from "../src/utils/prisma.js";

describe("updateTask mutation", () => {
  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.taskList.deleteMany();
  });

  it("updates a task title successfully", async () => {
    const taskList = await prisma.taskList.create({
      data: {
        name: "Work Tasks",
      },
    });

    const task = await prisma.task.create({
      data: {
        title: "Old title",
        taskListId: taskList.id,
      },
    });

    const mutation = `
      mutation {
        updateTask(
          id: "${task.id}"
          title: "Updated documentation"
        ) {
          id
          title
          completed
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

    expect(result.data.updateTask).toMatchObject({
      id: task.id,
      title: "Updated documentation",
    });

    const updatedTask = await prisma.task.findUnique({
      where: {
        id: task.id,
      },
    });

    expect(updatedTask?.title).toBe("Updated documentation");
  });

  it("updates a task's completed status successfully", async () => {
    const taskList = await prisma.taskList.create({
      data: {
        name: "Work Tasks",
      },
    });

    const task = await prisma.task.create({
      data: {
        title: "Test task",
        completed: false,
        taskListId: taskList.id,
      },
    });

    const mutation = `
      mutation {
        updateTask(
          id: "${task.id}"
          completed: true
        ) {
          id
          title
          completed
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
    expect(result.data.updateTask.completed).toBe(true);

    const updatedTask = await prisma.task.findUnique({
      where: {
        id: task.id,
      },
    });

    expect(updatedTask?.completed).toBe(true);
  });

  it("returns BAD_USER_INPUT when no update fields are provided", async () => {
    const taskList = await prisma.taskList.create({
      data: {
        name: "Work Tasks",
      },
    });

    const task = await prisma.task.create({
      data: {
        title: "Old title",
        taskListId: taskList.id,
      },
    });

    const mutation = `
      mutation {
        updateTask(
          id: "${task.id}"
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
      "At least one field (title or completed) must be provided",
    );

    expect(result.errors[0].extensions.code).toBe("BAD_USER_INPUT");
  });

  it("returns NOT_FOUND when task does not exist", async () => {
    const mutation = `
      mutation {
        updateTask(
          id: "cmxxxxxxxxxxxxxxxxxxxxxx"
          title: "Updated title"
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

    expect(result.errors[0].message).toBe("Task not found");

    expect(result.errors[0].extensions.code).toBe("NOT_FOUND");
  });

  it("prevents updating a task to a title that already exists in the same task list", async () => {
    const taskList = await prisma.taskList.create({
      data: {
        name: "Test Duplicate Check",
      },
    });

    const task1 = await prisma.task.create({
      data: {
        title: "Task A",
        taskListId: taskList.id,
      },
    });

    const task2 = await prisma.task.create({
      data: {
        title: "Task B",
        taskListId: taskList.id,
      },
    });

    const mutation = `
      mutation {
        updateTask(
          id: "${task2.id}"
          title: "Task A"
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
      "A task with this title already exists in this task list",
    );
    expect(result.errors[0].extensions.code).toBe("BAD_USER_INPUT");

    const unchangedTask = await prisma.task.findUnique({
      where: {
        id: task2.id,
      },
    });
    expect(unchangedTask?.title).toBe("Task B");

    const originalTask = await prisma.task.findUnique({
      where: {
        id: task1.id,
      },
    });
    expect(originalTask?.title).toBe("Task A");
  });

  it("allows updating a task to a title that exists in a different task list", async () => {
    const list1 = await prisma.taskList.create({
      data: { name: "List 1" },
    });

    const list2 = await prisma.taskList.create({
      data: { name: "List 2" },
    });

    const task1 = await prisma.task.create({
      data: {
        title: "Common Task",
        taskListId: list1.id,
      },
    });

    const task2 = await prisma.task.create({
      data: {
        title: "Different Task",
        taskListId: list2.id,
      },
    });

    const mutation = `
      mutation {
        updateTask(
          id: "${task2.id}"
          title: "Common Task"
        ) {
          id
          title
          taskList {
            id
            name
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
    expect(result.data.updateTask.title).toBe("Common Task");
    expect(result.data.updateTask.taskList.id).toBe(list2.id);

    const updatedTask = await prisma.task.findUnique({
      where: {
        id: task2.id,
      },
    });
    expect(updatedTask?.title).toBe("Common Task");

    const originalTask = await prisma.task.findUnique({
      where: {
        id: task1.id,
      },
    });
    expect(originalTask?.title).toBe("Common Task");
  });

  it("prevents updating a task to a duplicate title with different case", async () => {
    const taskList = await prisma.taskList.create({
      data: {
        name: "Test Case Insensitivity",
      },
    });

    const task1 = await prisma.task.create({
      data: {
        title: "go to the gym",
        taskListId: taskList.id,
      },
    });

    const task2 = await prisma.task.create({
      data: {
        title: "buy groceries",
        taskListId: taskList.id,
      },
    });

    const mutation = `
      mutation {
        updateTask(
          id: "${task2.id}"
          title: "Go To The Gym"
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
      "A task with this title already exists in this task list",
    );
    expect(result.errors[0].extensions.code).toBe("BAD_USER_INPUT");

    const unchangedTask = await prisma.task.findUnique({
      where: {
        id: task2.id,
      },
    });
    expect(unchangedTask?.title).toBe("buy groceries");
  });

  it("returns BAD_USER_INPUT when title is too short", async () => {
    const taskList = await prisma.taskList.create({
      data: {
        name: "Work Tasks",
      },
    });

    const task = await prisma.task.create({
      data: {
        title: "Valid title",
        taskListId: taskList.id,
      },
    });

    const mutation = `
      mutation {
        updateTask(
          id: "${task.id}"
          title: "ab"
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

  it("returns BAD_USER_INPUT when task id is invalid", async () => {
    const mutation = `
      mutation {
        updateTask(
          id: "invalid-id"
          title: "Updated title"
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
    expect(result.errors[0].message).toBe("Task id must be a valid CUID");
    expect(result.errors[0].extensions.code).toBe("BAD_USER_INPUT");
  });
});
