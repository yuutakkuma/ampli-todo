import { env } from "$amplify/env/todo-list";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Handler } from "aws-lambda";

const client = new DynamoDBClient({});

export const handler: Handler = async (event, context) => {
	const command = new ScanCommand({
		TableName: env.TODO_LIST_TABLE_NAME,
	});

	const response = await client.send(command);

	const todos = response.Items?.map((item) => unmarshall(item));

	return {
		statusCode: 200,
		body: todos,
	};
};
