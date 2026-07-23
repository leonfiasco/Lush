import { builder } from "../builder.js";
import prisma from "../../utils/prisma.js";

builder.queryField("tasks", (t) =>
  t.prismaField({
    type: ["Task"],

    args: {
      taskListId: t.arg.id({
        required: true,
      }),

      completed: t.arg.boolean({
        required: false,
      }),

      limit: t.arg.int({
        required: false,
        defaultValue: 10,
      }),

      offset: t.arg.int({
        required: false,
        defaultValue: 0,
      }),
    },

    resolve: async (query, _, args) => {
      const where = {
        taskListId: args.taskListId,

        ...(args.completed !== null && {
          completed: args.completed,
        }),
      };
      return prisma.task.findMany({
        ...query,

        where,

        take: args.limit ?? undefined,
        skip: args.offset ?? undefined,

        orderBy: {
          createdAt: "asc",
        },
      });
    },
  }),
);
