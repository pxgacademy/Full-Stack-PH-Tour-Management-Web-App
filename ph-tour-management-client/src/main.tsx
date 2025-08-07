import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router";
import { Toaster } from "./components/ui/sonner.tsx";
import "./index.css";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import { store } from "./redux/store.ts";
import { router } from "./routes/index.ts";

createRoot(document.getElementById("root")!).render(
  <ReduxProvider store={store}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster richColors />
    </ThemeProvider>
  </ReduxProvider>
);
