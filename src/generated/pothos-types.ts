/* eslint-disable */
import type { Prisma, TaskList, Task } from "/Users/user/Documents/my-projects/lush-tech-test/src/generated/prisma/index.js";
import type { PothosPrismaDatamodel } from "@pothos/plugin-prisma";
export default interface PrismaTypes {
    TaskList: {
        Name: "TaskList";
        Shape: TaskList;
        Include: Prisma.TaskListInclude;
        Select: Prisma.TaskListSelect;
        OrderBy: Prisma.TaskListOrderByWithRelationInput;
        WhereUnique: Prisma.TaskListWhereUniqueInput;
        Where: Prisma.TaskListWhereInput;
        Create: {};
        Update: {};
        RelationName: "tasks";
        ListRelations: "tasks";
        Relations: {
            tasks: {
                Shape: Task[];
                Name: "Task";
                Nullable: false;
            };
        };
    };
    Task: {
        Name: "Task";
        Shape: Task;
        Include: Prisma.TaskInclude;
        Select: Prisma.TaskSelect;
        OrderBy: Prisma.TaskOrderByWithRelationInput;
        WhereUnique: Prisma.TaskWhereUniqueInput;
        Where: Prisma.TaskWhereInput;
        Create: {};
        Update: {};
        RelationName: "taskList";
        ListRelations: never;
        Relations: {
            taskList: {
                Shape: TaskList;
                Name: "TaskList";
                Nullable: false;
            };
        };
    };
}
export function getDatamodel(): PothosPrismaDatamodel { return JSON.parse("{\"datamodel\":{\"models\":{\"TaskList\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Task\",\"kind\":\"object\",\"name\":\"tasks\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"TaskToTaskList\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Task\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"title\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"completed\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"taskListId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"TaskList\",\"kind\":\"object\",\"name\":\"taskList\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"TaskToTaskList\",\"relationFromFields\":[\"taskListId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]}}}}"); }