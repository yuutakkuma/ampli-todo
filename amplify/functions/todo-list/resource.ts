import { defineFunction } from "@aws-amplify/backend";

export const todoList = defineFunction({
	name: "todo-list",
	entry: "./handler.ts",
	resourceGroupName: "data",
});
