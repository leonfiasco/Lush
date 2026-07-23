import { builder } from "../builder.js";
import prisma from "../../utils/prisma.js";

builder.queryField("taskLists", (t) =>
  t.prismaField({
    type: ["TaskList"],

    resolve: async (query) => {
      return prisma.taskList.findMany(query);
    },
  }),
);
