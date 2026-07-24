import { builder } from "../builder.js";
import prisma from "../../utils/prisma.js";
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
      const offset = Math.max(0, args.offset ?? 0);
      const limit = args.limit
        ? Math.min(100, Math.max(1, args.limit))
        : undefined;

      const where = {
        taskListId: args.taskListId,
        ...(args.completed != null && {
          completed: args.completed,
        }),
      };

      return prisma.task.findMany({
        ...query,
        where,
        take: limit,
        skip: offset,
        orderBy: {
          createdAt: "asc",
        },
      });
    },
  }),
);
