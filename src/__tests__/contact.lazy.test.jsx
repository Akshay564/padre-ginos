import { QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import createFetchMock from "vitest-fetch-mock";
import { Route } from "../routes/contact.lazy";
import { test, vi } from "vitest";

const queryClient = new QueryClient();

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

test("can submit contact form", async () => {
  fetchMocker.mockResponse(JSON.stringify({ status: "ok" }));
  const screen = render(
    <QueryClientProvider client={queryClient}>
      <Route.options.component />
    </QueryClientProvider>,
  );

  const nameInput = screen.getByPlaceholderText("Name");
  const emailInput = screen.getByPlaceholderText("Name");
  const msgTextArea = screen.getByPlaceholderText("Name");

  const testData = {
    name: "John",
    email: "test@example.com",
    message: "This is a test message",
  };
});
