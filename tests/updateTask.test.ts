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
});
