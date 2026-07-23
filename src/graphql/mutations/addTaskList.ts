import { builder } from "../builder.js";
import prisma from "../../utils/prisma.js";

builder.mutationField("addTaskList", (t) =>
  t.prismaField({
    type: "TaskList",

    args: {
      name: t.arg.string({
        required: true,
      }),
    },

    resolve: async (query, _, args) => {
      return prisma.taskList.create({
        ...query,
        data: {
          name: args.name,
        },
      });
    },
  }),
);
