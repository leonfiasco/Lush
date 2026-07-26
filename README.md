# Task Management GraphQL API

A GraphQL API for managing task lists and tasks built with Node.js, TypeScript, GraphQL Yoga, Pothos GraphQL, Prisma, SQLite, Zod, and Vitest.

The API supports:

- Creating task lists
- Creating tasks within task lists
- Fetching all task lists
- Fetching tasks by task list
- Filtering tasks by completion status
- Pagination for tasks
- Updating tasks
- Deleting tasks
- Preventing duplicate task lists
- Preventing duplicate tasks within the same task list

---

## Tech Stack

- Node.js
- TypeScript
- GraphQL Yoga
- Pothos GraphQL
- Prisma ORM
- SQLite
- Zod
- Vitest

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>

cd <project-folder>
```

---

### 2. Install dependencies

Using Yarn:

```bash
yarn install
```

or using npm:

```bash
npm install
```

---

### 3. Configure environment variables

Create a `.env` file in the project root:

```bash
DATABASE_URL="file:./prisma/dev.db"
```

Alternatively, copy the example environment file:

```bash
cp .env.example .env
```

---

### 4. Set up the database

Run Prisma migrations:

```bash
yarn prisma migrate dev
```

Generate the Prisma client:

```bash
yarn prisma generate
```

---

### 5. Seed the database

Populate the database with sample task lists and tasks:

```bash
yarn prisma db seed
```

This provides sample data that can be queried immediately through GraphQL.

---

### 6. Start the development server

```bash
yarn dev
```

The GraphQL server will start at:

```
http://localhost:4000/graphql
```

Open this URL in your browser to access GraphQL Yoga's interactive GraphQL IDE, where you can run queries and mutations.

---

## Example Query

Fetch all task lists:

```GraphQL
query {
  taskLists {
    id
    name
    createdAt
  }
}
```

---

Fetch tasks for a specific task list:

```GraphQL
query {
  tasks(
    taskListId: "task_list_id"
    completed: false
    limit: 10
    offset: 0
  ) {
    id
    title
    completed
  }
}
```

Fetch a single task by ID

```GraphQL
query {
  task(id: "task_id") {
    id
    title
    completed
    createdAt
    updatedAt
    taskList {
      id
      name
    }
  }
}
```

---

## Example Mutation

Create a task list:

```GraphQL
mutation {
  addTaskList(
    name: "Personal Tasks"
  ) {
    id
    name
  }
}
```

---

Create a task:

```GraphQL
mutation {
  addTask(
    title: "Write documentation"
    taskListId: "task_list_id"
  ) {
    id
    title
    completed
  }
}
```

---

Update a task:

```GraphQL
mutation {
  updateTask(
    id: "task_id"
    title: "Updated documentation"
    completed: true
  ) {
    id
    title
    completed
  }
}
```

---

Delete a task:

```GraphQL
mutation {
  deleteTask(
    id: "task_id"
  ) {
    id
  }
}
```

---

## Decisions

### Pagination Approach

I chose offset-based pagination for the `tasks` query.

The query accepts:

- `limit` - controls the number of records returned
- `offset` - controls where the result set starts

Example:

```GraphQL
query {
  tasks(
    taskListId: "task_list_id"
    limit: 10
    offset: 20
  ) {
    id
    title
  }
}
```

This approach was chosen because it is simple to implement and suitable for a small task management API.

For a larger production system with frequently changing data, I would consider cursor-based pagination because it provides more stable pagination performance.

---

## Error Handling Approach

Errors are handled using GraphQL errors with explicit error codes.

Examples:

### Missing resource

When requesting, updating, or deleting a task that does not exist:

```JSON
{
  "message": "Task not found",
  "extensions": {
    "code": "NOT_FOUND"
  }
}
```

### Invalid input

Validation errors are handled using the Pothos Zod plugin.

Example:

```JSON
{
  "message": "Task title must be at least 3 characters",
  "extensions": {
    "code": "BAD_USER_INPUT"
  }
}
```

This provides:

- A human-readable error message
- A machine-readable error code for clients

---

## Validation Approach

Input validation is handled using Zod schemas through the Pothos Zod plugin.

Examples of validation rules:

- Task titles must be between 3 and 30 characters
- Task list names must be between 3 and 30 characters
- Task IDs must be valid CUIDs
- Task list IDs must be valid CUIDs
- Pagination limits cannot exceed 100
- Pagination offsets cannot be negative

Duplicate handling:

- Task list names cannot be duplicated
- Task titles cannot be duplicated within the same task list
- Duplicate checks are case-insensitive
- Original title/name capitalisation is preserved

Validation occurs before resolver execution where possible.

---

## Testing Approach

I used Vitest for integration tests.

The tests execute GraphQL operations through GraphQL Yoga and verify:

- GraphQL responses
- Resolver behaviour
- Prisma database changes
- Validation behaviour
- Error responses

Tests currently cover:

### addTaskList

- Successfully creates a task list
- Prevents duplicate task list names
- Prevents duplicate names with different casing
- Trims whitespace
- Validates incorrect input

### addTask

- Successfully creates a task
- Handles missing task lists
- Prevents duplicate task titles within the same task list
- Allows duplicate titles across different task lists
- Preserves title capitalisation
- Validates incorrect input

### updateTask

- Successfully updates task titles
- Successfully updates completion status
- Prevents duplicate task titles within the same task list
- Allows duplicate titles across different task lists
- Handles missing tasks
- Rejects empty updates
- Validates incorrect input

### deleteTask

- Successfully deletes a task
- Handles missing tasks

Integration testing was chosen because it shows the interaction between:

- GraphQL schema
- Pothos resolvers
- Validation
- Prisma database operations

rather than only testing isolated functions.

---

## Running Tests

Run:

```bash
yarn test
```

Vitest will execute the integration test suite.

---

## Future Improvements

With more time, I would consider adding:

### Authentication and Authorisation

Introduce users and permissions so task lists are owned by specific users.

---

### Cursor Pagination

Replace offset pagination with cursor pagination for better performance with large datasets.

---

### More Comprehensive Testing

Add additional tests covering:

- Query resolvers
- Pagination edge cases
- Validation edge cases
- Database constraint failures

---

### Centralised Error Handling

Create custom GraphQL error classes to standardise error creation across resolvers.

---

### Database Improvements

Move from SQLite to PostgreSQL for production usage and add database indexes for frequently queried fields.
