import { builder } from "../builder.js";
import prisma from "../../utils/prisma.js";

builder.mutationField("updateTask", (t) =>
  t.prismaField({
    type: "Task",

    args: {
      id: t.arg.id({
        required: true,
      }),

      title: t.arg.string({
        required: false,
      }),

      completed: t.arg.boolean({
        required: false,
      }),
    },

    resolve: async (query, _, args) => {
      const data = {
        ...(args.title != null && {
          title: args.title,
        }),

        ...(args.completed != null && {
          completed: args.completed,
        }),
      };

      return prisma.task.update({
        ...query,

        where: {
          id: args.id,
        },

        data,
      });
    },
  }),
);
