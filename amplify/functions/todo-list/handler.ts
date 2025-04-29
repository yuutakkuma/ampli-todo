import { env } from "$amplify/env/todo-list";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import type { Schema } from "../../data/resource";

const client = new DynamoDBClient({});

export const handler: Schema["getTodoList"]["functionHandler"] = async (event, context) => {
	if (!event.identity) {
		throw new Error("identityがありません。");
	}

	let userId = "";

	if ("sub" in event.identity) {
		userId = event.identity.sub;
	}

	const command = new ScanCommand({
		FilterExpression: "#userId = :userIdValue",
		ExpressionAttributeNames: {
			"#userId": "userId",
		},
		ExpressionAttributeValues: {
			":userIdValue": { S: userId },
		},
		TableName: env.TODO_LIST_TABLE_NAME,
	});

	const response = await client.send(command);

	const todos = response.Items?.map((item) => unmarshall(item));

	return {
		statusCode: 200,
		body: todos,
	};
};
