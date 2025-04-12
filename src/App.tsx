import { Button } from "@/components/ui/button";

function App() {
	return (
		<div className="flex flex-col items-center justify-center min-h-svh">
			<Button
				onClick={() => {
					alert("on click! shadcn button!");
				}}
			>
				Click me
			</Button>
		</div>
	);
}

export default App;
