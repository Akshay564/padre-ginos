export default async function getPizzaOfTheDay({ signal } = {}) {
  const response = await fetch("/api/pizza-of-the-day", {
    signal, // Pass the AbortController signal
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch pizza of the day: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data;
}
