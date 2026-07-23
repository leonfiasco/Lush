import { builder } from "../builder.js";

builder.prismaObject("TaskList", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    createdAt: t.expose("createdAt", {
      type: "DateTime",
    }),
    tasks: t.relation("tasks"),
  }),
});
