import { builder } from "../builder.js";
import prisma from "../../utils/prisma.js";
import { z } from "zod";

builder.mutationField("addTaskList", (t) =>
  t.prismaField({
    type: "TaskList",

    args: {
      name: t.arg.string({
        required: true,

        validate: {
          schema: z
            .string()
            .min(3, "Task list name must be at least 3 characters")
            .max(30, "Task list name cannot exceed 30 characters"),
        },
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
