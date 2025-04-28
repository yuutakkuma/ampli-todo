import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../App";

type TodoListResonse = {
	id: string;
	content: string;
	isDone: boolean;
	createdAt: string;
	updatedAt: string;
};

export function TodoList() {
	const {
		data: todos,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["TODO_LIST"],
		queryFn: async (): Promise<TodoListResonse[]> => {
			const list = await client.queries.getTodoList();

			if (!list.data?.body || typeof list.data?.body !== "string") {
				throw new Error("not body data.");
			}

			const response = JSON.parse(list.data.body);
			return response as TodoListResonse[];
		},
	});
	const { isPending: deleteIsPending, mutateAsync: deleteMutate } = useMutation({
		mutationFn: (id: string) => {
			return client.models.Todo.delete({ id });
		},
		onSuccess: () => {
			refetch();
		},
	});
	const { isPending: updateIsPending, mutateAsync: updateMutate } = useMutation({
		mutationFn: ({ id, isDone }: { id: string; isDone: boolean }) => {
			return client.models.Todo.update({ id, isDone });
		},
		onSuccess: () => {
			refetch();
		},
	});

	if (isLoading) {
		return <p>isLoading...</p>;
	}

	if (!todos?.length) {
		return <p>no todo data.</p>;
	}

	const isMutationPending = deleteIsPending || updateIsPending;

	return (
		<div style={{ width: "100%", display: "flex", alignItems: "center", flexDirection: "column" }}>
			{todos?.map((todo) => (
				<div
					key={todo.id}
					style={{
						display: "flex",
						width: "80%",
						flexGrow: 1,
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						borderWidth: 1,
						borderStyle: "solid",
						borderColor: "skyblue",
						marginBottom: 10,
						backgroundColor: todo.isDone ? "gray" : "transparent",
					}}
				>
					<b style={{ marginLeft: 10, fontSize: 25, color: "#222" }}>{todo.content}</b>
					<div>
						<b>{todo.createdAt}</b>
						<button
							style={{ backgroundColor: todo.isDone ? "darkorange" : "yellowgreen", marginLeft: 10, marginRight: 10 }}
							onClick={async () => {
								const result = await updateMutate({ id: todo.id, isDone: !todo.isDone });
								if (result.errors) {
									alert("ゲストユーザーはデータの更新はできません。");
								}
							}}
						>
							{todo.isDone ? "UNDO" : "DONE"}
						</button>
						<button
							style={{ backgroundColor: "crimson", marginRight: 10 }}
							disabled={isMutationPending}
							onClick={async () => {
								const result = await deleteMutate(todo.id);
								if (result.errors) {
									alert("ゲストユーザーはデータの更新はできません。");
								}
							}}
						>
							DELETE
						</button>
					</div>
				</div>
			))}
		</div>
	);
}
