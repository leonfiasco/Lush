import { builder } from "../builder.js";
import prisma from "../../utils/prisma.js";
import { GraphQLError } from "graphql";
import { z } from "zod";

builder.mutationField("addTask", (t) =>
  t.prismaField({
    type: "Task",

    args: {
      title: t.arg.string({
        required: true,

        validate: {
          schema: z
            .string()
            .trim()
            .min(3, "Task title must be at least 3 characters")
            .max(30, "Task title cannot exceed 30 characters"),
        },
      }),

      taskListId: t.arg.id({
        required: true,

        validate: {
          schema: z
            .string()
            .min(1, "taskListId cannot be empty")
            .cuid("taskListId must be a valid CUID"),
        },
      }),
    },

    resolve: async (query, _, args) => {
      const trimmedTitle = args.title.trim();

      const taskList = await prisma.taskList.findUnique({
        where: {
          id: args.taskListId,
        },
      });

      if (!taskList) {
        throw new GraphQLError("Task list not found", {
          extensions: {
            code: "NOT_FOUND",
          },
        });
      }

      const existingTasks = await prisma.task.findMany({
        where: {
          taskListId: args.taskListId,
        },
      });

      const duplicate = existingTasks.find(
        (task) =>
          task.title.trim().toLowerCase() === trimmedTitle.toLowerCase(),
      );

      if (duplicate) {
        throw new GraphQLError(
          "A task with this title already exists in this task list",
          {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          },
        );
      }

      return prisma.task.create({
        ...query,

        data: {
          title: trimmedTitle,
          taskListId: args.taskListId,
        },
      });
    },
  }),
);
