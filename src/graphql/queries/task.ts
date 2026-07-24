import { builder } from "../builder.js";
import prisma from "../../utils/prisma.js";
import { GraphQLError } from "graphql";
import { z } from "zod";

builder.queryField("task", (t) =>
  t.prismaField({
    type: "Task",

    args: {
      id: t.arg.id({
        required: true,

        validate: {
          schema: z
            .string()
            .min(1, "Task id cannot be empty")
            .cuid("Task id must be a valid CUID"),
        },
      }),
    },

    resolve: async (query, _, args) => {
      const task = await prisma.task.findUnique({
        ...query,

        where: {
          id: args.id,
        },
      });

      if (!task) {
        throw new GraphQLError("Task not found", {
          extensions: {
            code: "NOT_FOUND",
          },
        });
      }

      return task;
    },
  }),
);
