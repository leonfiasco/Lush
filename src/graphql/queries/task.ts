import { builder } from "../builder.js";
import prisma from "../../utils/prisma.js";

builder.queryField("task", (t) =>
  t.prismaField({
    type: "Task",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _, args) => {
      return prisma.task.findUnique({
        ...query,
        where: { id: args.id },
      });
    },
  }),
);
