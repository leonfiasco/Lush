import { describe, it, expect } from "vitest";
import { yoga } from "../src/graphql/yoga";
import prisma from "../src/utils/prisma.js";

describe("addTaskList mutation", () => {
  it("creates a task list successfully", async () => {
    const mutation = `
      mutation {
        addTaskList(
          name: "Work Tasks"
        ) {
          id
          name
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

    expect(result.data.addTaskList).toMatchObject({
      name: "Work Tasks",
    });

    const taskList = await prisma.taskList.findUnique({
      where: {
        id: result.data.addTaskList.id,
      },
    });

    expect(taskList?.name).toBe("Work Tasks");
  });

  it("returns BAD_USER_INPUT when task list already exists", async () => {
    await prisma.taskList.create({
      data: {
        name: "Work Tasks",
      },
    });

    const mutation = `
      mutation {
        addTaskList(
          name: "Work Tasks"
        ) {
          id
          name
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

    expect(result.errors[0].message).toBe("Task list already exists");

    expect(result.errors[0].extensions.code).toBe("BAD_USER_INPUT");
  });

  it("returns BAD_USER_INPUT when task list already exists with different casing", async () => {
    await prisma.taskList.create({
      data: {
        name: "Work Tasks",
      },
    });

    const mutation = `
      mutation {
        addTaskList(
          name: "work tasks"
        ) {
          id
          name
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

    expect(result.errors[0].message).toBe("Task list already exists");

    expect(result.errors[0].extensions.code).toBe("BAD_USER_INPUT");
  });

  it("trims whitespace from task list name", async () => {
    const mutation = `
      mutation {
        addTaskList(
          name: "   Work Tasks   "
        ) {
          id
          name
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

    expect(result.data.addTaskList.name).toBe("Work Tasks");
  });

  it("returns BAD_USER_INPUT when name is too short", async () => {
    const mutation = `
      mutation {
        addTaskList(
          name: "ab"
        ) {
          id
          name
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
      "Task list name must be at least 3 characters",
    );

    expect(result.errors[0].extensions.code).toBe("BAD_USER_INPUT");
  });

  it("returns BAD_USER_INPUT when name exceeds 30 characters", async () => {
    const mutation = `
      mutation {
        addTaskList(
          name: "This task list name is definitely longer than thirty characters"
        ) {
          id
          name
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
      "Task list name cannot exceed 30 characters",
    );

    expect(result.errors[0].extensions.code).toBe("BAD_USER_INPUT");
  });
});
