import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import prisma from "../utils/prisma.js";
import type PrismaTypes from "../generated/pothos-types.js";
import { Prisma } from "../generated/prisma/index.js";
import { DateTimeResolver } from "graphql-scalars";
import ZodPlugin from "@pothos/plugin-zod";
import { GraphQLError } from "graphql";

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [PrismaPlugin, ZodPlugin],

  zod: {
    validationError: (zodError) => {
      return new GraphQLError(zodError.issues[0].message, {
        extensions: {
          code: "BAD_USER_INPUT",
        },
      });
    },
  },

  prisma: {
    client: prisma,
    dmmf: Prisma.dmmf,
  },
});

builder.addScalarType("DateTime", DateTimeResolver);
