-- CreateTable
CREATE TABLE "task_lists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "taskListId" TEXT NOT NULL,
    CONSTRAINT "tasks_taskListId_fkey" FOREIGN KEY ("taskListId") REFERENCES "task_lists" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
