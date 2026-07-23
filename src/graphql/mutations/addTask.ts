import { builder } from "../builder.js";
import prisma from "../../utils/prisma.js";

builder.mutationField("addTask", (t) =>
  t.prismaField({
    type: "Task",

    args: {
      title: t.arg.string({
        required: true,
      }),

      taskListId: t.arg.id({
        required: true,
      }),
    },

    resolve: async (query, _, args) => {
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
