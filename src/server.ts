import { createServer } from "node:http";
import { yoga } from "./graphql/yoga/index.js";

const server = createServer(yoga);

const port = 4000;

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/graphql 🚀`);
});
