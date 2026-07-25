import { describe, it, expect } from "vitest";
import { yoga } from "../src/graphql/yoga";
import prisma from "../src/utils/prisma.js";

describe("deleteTask mutation", () => {
  it("deletes a task successfully", async () => {
    const taskList = await prisma.taskList.create({
      data: {
        name: "Work Tasks",
      },
    });

    const task = await prisma.task.create({
      data: {
        title: "Delete documentation",
        taskListId: taskList.id,
      },
    });

    const mutation = `
      mutation {
        deleteTask(
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

    expect(result.errors).toBeUndefined();

    expect(result.data.deleteTask).toMatchObject({
      id: task.id,
      title: "Delete documentation",
    });

    const deletedTask = await prisma.task.findUnique({
      where: {
        id: task.id,
      },
    });

    expect(deletedTask).toBeNull();
  });

  it("returns NOT_FOUND when task does not exist", async () => {
    const mutation = `
      mutation {
        deleteTask(
          id: "cmxxxxxxxxxxxxxxxxxxxxxx"
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
