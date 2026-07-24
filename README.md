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

### 2. Install dependencies

Using Yarn:

```bash
yarn install
```

or using npm:

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```bash
DATABASE_URL="file:./dev.db"
```

---

### 4. Setup the database

Run Prisma migrations:

```bash
yarn prisma migrate dev
```

Generate the Prisma client:

```bash
yarn prisma generate
```

---

### 5. Start the development server

```bash
yarn dev
```

The GraphQL server will start at:

```
http://localhost:4000/graphql
```

You can test queries and mutations using the GraphQL Playground.

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

---

## Example Mutation

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

## Error Handling Approach

Errors are handled using GraphQL errors with explicit error codes.

Examples:

### Missing resource

When requesting or updating a task that does not exist:

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
- Task list IDs must be valid CUIDs
- Pagination limits cannot exceed 100
- Pagination offsets cannot be negative

Validation occurs before resolver execution.

---

## Testing Approach

I used Vitest for integration tests.

The tests execute GraphQL operations through GraphQL Yoga and verify:

- GraphQL responses
- Resolver behaviour
- Prisma database changes

Tests currently cover:

### addTask

- Successfully creates a task
- Handles missing task lists
- Validates incorrect input

### updateTask

- Successfully updates a task
- Rejects empty updates
- Handles missing tasks

Integration testing was chosen because it shows the interaction between:

- GraphQL schema
- Pothos resolvers
- Validation
- Prisma database operations

rather than only testing isolated functions.

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

- Delete mutations
- Query resolvers
- Pagination edge cases
- Database constraint failures

---

### Centralised Error Handling

Create custom GraphQL error classes to standardise error creation across resolvers.

---

### Database Improvements

Move from SQLite to PostgreSQL for production usage and add database indexes for frequently queried fields.
