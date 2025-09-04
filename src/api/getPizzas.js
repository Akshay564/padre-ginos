export default async function getPizzas({ signal } = {}) {
  const response = await fetch("/api/pizzas", {
    signal, // Pass the AbortController signal
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch pizzas: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data;
}
