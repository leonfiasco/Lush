import { builder } from "./builder.js";

// types
import "./types/index.js";

// queries
import "./queries/index.js";

// mutations
import "./mutations/index.js";

builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema();
