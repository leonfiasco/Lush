import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.taskList.deleteMany();

  // Create task lists with tasks
  await prisma.taskList.create({
    data: {
      name: "Work",
      tasks: {
        create: [
          {
            title: "Finish GraphQL assignment",
            completed: false,
          },
          {
            title: "Review pull request",
            completed: true,
          },
        ],
      },
    },
  });

  await prisma.taskList.create({
    data: {
      name: "Personal",
      tasks: {
        create: [
          {
            title: "Go to the gym",
            completed: false,
          },
          {
            title: "Buy groceries",
            completed: true,
          },
        ],
      },
    },
  });

  console.log("✅ Database seeded");
}

main()
  .catch((e) => {
    console.error(e);
    // process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
