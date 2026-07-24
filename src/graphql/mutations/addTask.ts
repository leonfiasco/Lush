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
            .min(1, "Task title cannot be empty")
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

      return prisma.task.create({
        ...query,

        data: {
          title: args.title,
          taskListId: args.taskListId,
        },
      });
    },
  }),
);
