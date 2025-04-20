import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Authenticator } from "@aws-amplify/ui-react";
import App from "./App.tsx";
// css
import "@aws-amplify/ui-react/styles.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Authenticator.Provider>
			<App />
		</Authenticator.Provider>
	</StrictMode>,
);
