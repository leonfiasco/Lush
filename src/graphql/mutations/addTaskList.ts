import { builder } from "../builder.js";
import prisma from "../../utils/prisma.js";
import { GraphQLError } from "graphql";
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
            .trim()
            .min(3, "Task list name must be at least 3 characters")
            .max(30, "Task list name cannot exceed 30 characters"),
        },
      }),
    },

    resolve: async (query, _, args) => {
      const existingTaskList = await prisma.taskList.findFirst({
        where: {
          name: args.name.trim(),
        },
      });

      if (existingTaskList) {
        throw new GraphQLError("Task list already exists", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      return prisma.taskList.create({
        ...query,

        data: {
          name: args.name.trim(),
        },
      });
    },
  }),
);
