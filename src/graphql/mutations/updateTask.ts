import { builder } from "../builder.js";
import prisma from "../../utils/prisma.js";
import { GraphQLError } from "graphql";
import { z } from "zod";

builder.mutationField("updateTask", (t) =>
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

      title: t.arg.string({
        required: false,

        validate: {
          schema: z
            .string()
            .trim()
            .min(3, "Task title must be at least 3 characters")
            .max(30, "Task title cannot exceed 30 characters"),
        },
      }),

      completed: t.arg.boolean({
        required: false,
      }),
    },

    resolve: async (query, _, args) => {
      if (args.title == null && args.completed == null) {
        throw new GraphQLError(
          "At least one field (title or completed) must be provided",
          {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          },
        );
      }

      const task = await prisma.task.findUnique({
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

      const data: {
        title?: string;
        completed?: boolean;
      } = {};

      if (args.completed != null) {
        data.completed = args.completed;
      }

      if (args.title != null) {
        const trimmedTitle = args.title.trim();

        const existingTasks = await prisma.task.findMany({
          where: {
            taskListId: task.taskListId,
            id: {
              not: args.id,
            },
          },
        });

        const duplicate = existingTasks.find(
          (t) => t.title.trim().toLowerCase() === trimmedTitle.toLowerCase(),
        );

        if (duplicate) {
          throw new GraphQLError(
            "A task with this title already exists in this task list",
            {
              extensions: {
                code: "BAD_USER_INPUT",
              },
            },
          );
        }

        data.title = trimmedTitle;
      }

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
