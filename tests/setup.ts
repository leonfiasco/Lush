import { beforeEach } from "vitest";
import prisma from "../src/utils/prisma.js";

beforeEach(async () => {
  await prisma.task.deleteMany();
  await prisma.taskList.deleteMany();
});
