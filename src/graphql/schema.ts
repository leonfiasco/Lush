import { builder } from "./builder.js";

// types
import "./types/index.js";

// queries
import "./queries/index.js";

builder.queryType({});

export const schema = builder.toSchema();
