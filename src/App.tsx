import { useState } from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Schema } from "../amplify/data/resource.ts";
// components
import { TodoList } from "./components/TodoList";
// json
import outputs from "../amplify_outputs.json";
import { AddTodo } from "./components/AddTodo.tsx";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 0,
		},
	},
});

Amplify.configure(outputs);

export const client = generateClient<Schema>();

function App() {
	const { authStatus, signOut } = useAuthenticator();
	const [isGuest, setIsGuest] = useState<boolean>(false);

	if (authStatus === "unauthenticated" && !isGuest)
		return (
			<div>
				<Authenticator />
				<button
					onClick={() => {
						setIsGuest(true);
					}}
				>
					ゲストユーザーで使用する
				</button>
			</div>
		);

	const logout = () => {
		setIsGuest(false);
		signOut();
	};

	return (
		<QueryClientProvider client={queryClient}>
			<button onClick={logout}>ログアウト</button>
			<h1>ADD TODO</h1>
			<AddTodo />
			<h1>TODO LIST</h1>
			<TodoList />
		</QueryClientProvider>
	);
}

export default App;
