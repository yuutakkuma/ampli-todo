import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../App";
import { useState } from "react";

export function AddTodo() {
	const queryClient = useQueryClient();
	const [value, setValue] = useState<string>("");
	const { mutate } = useMutation({
		mutationFn: (content: string) => {
			console.log("mutation add todo.");

			return client.models.Todo.create({ content, isDone: false });
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
					if (value) {
						mutate(value);
					}
				}}
			>
				ADD
			</button>
		</div>
	);
}
