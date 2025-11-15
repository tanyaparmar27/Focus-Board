import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply initial theme class synchronously to avoid a flash of wrong theme.
try {
	const theme = localStorage.getItem("theme");
	const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
	if (theme === "dark" || (!theme && prefersDark)) {
		document.documentElement.classList.add("dark");
	} else {
		document.documentElement.classList.remove("dark");
	}
} catch (e) {
	// ignore
}

createRoot(document.getElementById("root")!).render(<App />);
