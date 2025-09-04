export default async function getPastOrders(pageNo, { signal } = {}) {
  const response = await fetch(`/api/past-orders?page=${pageNo}`, {
    signal, // Pass the AbortController signal
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch past orders: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data;
}
