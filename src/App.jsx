import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoadingProvider } from "./LoadingContext";
import GlobalLoader from "./GlobalLoader";

const router = createRouter({ routeTree });
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <GlobalLoader />
        <RouterProvider router={router} />
      </LoadingProvider>
    </QueryClientProvider>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
