import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../App";

export function TodoList() {
	const {
		data: todos,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["TODO_LIST"],
		queryFn: () => {
			return client.models.Todo.list();
		},
	});
	const { isPending: deleteIsPending, mutate: deleteMutate } = useMutation({
		mutationFn: (id: string) => {
			return client.models.Todo.delete({ id });
		},
		onSuccess: () => {
			refetch();
		},
	});
	const { isPending: updateIsPending, mutate: updateMutate } = useMutation({
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

	if (!todos?.data.length) {
		return <p>no todo data.</p>;
	}

	const isMutationPending = deleteIsPending || updateIsPending;

	return (
		<div style={{ width: "100%", display: "flex", alignItems: "center", flexDirection: "column" }}>
			{todos?.data.map((todo) => (
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
							onClick={() => {
								updateMutate({ id: todo.id, isDone: !todo.isDone });
							}}
						>
							{todo.isDone ? "UNDO" : "DONE"}
						</button>
						<button
							style={{ backgroundColor: "crimson", marginRight: 10 }}
							disabled={isMutationPending}
							onClick={() => {
								deleteMutate(todo.id);
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
