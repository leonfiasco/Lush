import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.taskList.deleteMany();

  // Create Work task list with many tasks
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
          {
            title: "Update documentation",
            completed: false,
          },
          {
            title: "Fix production bug",
            completed: true,
          },
          {
            title: "Deploy to staging",
            completed: false,
          },
          {
            title: "Write unit tests",
            completed: true,
          },
          {
            title: "Refactor API endpoints",
            completed: false,
          },
          {
            title: "Update dependencies",
            completed: false,
          },
          {
            title: "Code review for team member",
            completed: true,
          },
          {
            title: "Setup monitoring",
            completed: false,
          },
          {
            title: "Create database migration",
            completed: true,
          },
          {
            title: "Optimize query performance",
            completed: false,
          },
        ],
      },
    },
  });

  // Create Personal task list with many tasks
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
          {
            title: "Plan weekend trip",
            completed: false,
          },
          {
            title: "Read a book",
            completed: false,
          },
          {
            title: "Call mom",
            completed: true,
          },
          {
            title: "Clean the apartment",
            completed: false,
          },
          {
            title: "Pay bills",
            completed: true,
          },
          {
            title: "Schedule dentist appointment",
            completed: false,
          },
          {
            title: "Meal prep for the week",
            completed: true,
          },
          {
            title: "Practice guitar",
            completed: false,
          },
          {
            title: "Watch tutorial videos",
            completed: false,
          },
          {
            title: "Update resume",
            completed: true,
          },
          {
            title: "Organize photos",
            completed: false,
          },
          {
            title: "Buy birthday gift",
            completed: false,
          },
        ],
      },
    },
  });

  await prisma.taskList.create({
    data: {
      name: "Side Project",
      tasks: {
        create: [
          {
            title: "Design UI mockups",
            completed: true,
          },
          {
            title: "Setup project repository",
            completed: true,
          },
          {
            title: "Implement authentication",
            completed: false,
          },
          {
            title: "Build REST API",
            completed: false,
          },
          {
            title: "Create frontend components",
            completed: false,
          },
          {
            title: "Write project documentation",
            completed: false,
          },
          {
            title: "Deploy to production",
            completed: false,
          },
        ],
      },
    },
  });

  console.log("✅ Database seeded");
  console.log("📊 Task counts by list:");

  const taskLists = await prisma.taskList.findMany({
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });

  taskLists.forEach((list) => {
    console.log(`  - ${list.name}: ${list._count.tasks} tasks`);
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
