import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../App";
import { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";

type AddTodo = {
	userId: string;
	content: string;
};

export function AddTodo() {
	const queryClient = useQueryClient();
	const [value, setValue] = useState<string>("");
	const { user } = useAuthenticator();

	const { mutate } = useMutation({
		mutationFn: ({ content, userId }: AddTodo) => {
			return client.models.Todo.create({ userId, content, isDone: false });
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["TODO_LIST"], refetchType: "all" });

			setValue("");
		},
	});

	return (
		<div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
			<input
				style={{ width: "50%", maxWidth: 500 }}
				type="text"
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
			/>
			<button
				style={{ marginLeft: 10, marginRight: 10 }}
				onClick={() => {
					setValue("");
				}}
			>
				CANCEL
			</button>
			<button
				onClick={async () => {
					if (value && user.userId) {
						mutate({ content: value, userId: user.userId });
					}
				}}
			>
				ADD
			</button>
		</div>
	);
}
