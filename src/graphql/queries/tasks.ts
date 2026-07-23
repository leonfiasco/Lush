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
    },

    resolve: async (query, root, args) => {
      return prisma.task.findMany({
        ...query,

        where: {
          taskListId: args.taskListId,

          ...(args.completed !== null &&
            args.completed !== undefined && {
              completed: args.completed,
            }),
        },
      });
    },
  }),
);
