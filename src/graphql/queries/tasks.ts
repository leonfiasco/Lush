import { builder } from "../builder.js";
import prisma from "../../utils/prisma.js";
import { GraphQLError } from "graphql";
import { z } from "zod";

builder.queryField("tasks", (t) =>
  t.prismaField({
    type: ["Task"],

    args: {
      taskListId: t.arg.id({
        required: true,

        validate: {
          schema: z
            .string()
            .min(1, "taskListId cannot be empty")
            .cuid("taskListId must be a valid CUID"),
        },
      }),

      completed: t.arg.boolean({
        required: false,
      }),

      limit: t.arg.int({
        required: false,

        validate: {
          min: [
            1,
            {
              message: "limit must be at least 1",
            },
          ],

          max: [
            100,
            {
              message: "limit cannot exceed 100",
            },
          ],
        },
      }),

      offset: t.arg.int({
        required: false,

        validate: {
          min: [
            0,
            {
              message: "offset cannot be negative",
            },
          ],
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

      return prisma.task.findMany({
        ...query,

        where: {
          taskListId: args.taskListId,

          ...(args.completed != null && {
            completed: args.completed,
          }),
        },

        take: args.limit ?? undefined,

        skip: args.offset ?? undefined,

        orderBy: {
          createdAt: "asc",
        },
      });
    },
  }),
);
