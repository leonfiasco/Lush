// src/server.ts
import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { schema } from "./graphql/schema.js";

const yoga = createYoga({
  schema,
});

const server = createServer(yoga);

const port = 4000;

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/graphql 🚀`);
});
