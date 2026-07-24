import { builder } from "../builder.js";
import prisma from "../../utils/prisma.js";

builder.mutationField("deleteTask", (t) =>
  t.prismaField({
    type: "Task",

    args: {
      id: t.arg.id({
        required: true,
      }),
    },

    resolve: async (query, _, args) => {
      return prisma.task.delete({
        ...query,

        where: {
          id: args.id,
        },
      });
    },
  }),
);
