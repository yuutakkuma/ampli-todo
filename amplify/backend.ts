import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { todoList } from "./functions/todo-list/resource";
import { sayHello } from "./functions/say-hello/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
	auth,
	data,
	todoList,
	sayHello,
});

const todoTable = backend.data.resources.tables["Todo"];
const policy = new Policy(Stack.of(todoTable), "TodoListFunctionPolicy", {
	statements: [
		new PolicyStatement({
			effect: Effect.ALLOW,
			actions: ["dynamodb:GetItem", "dynamodb:Query", "dynamodb:Scan"],
			resources: [todoTable.tableArn],
		}),
	],
});

backend.todoList.resources.lambda.role?.attachInlinePolicy(policy);
backend.todoList.addEnvironment("TODO_LIST_TABLE_NAME", todoTable.tableName);
