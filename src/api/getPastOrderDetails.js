export default async function getPastOrderDetails(order, { signal } = {}) {
  const response = await fetch(`/api/past-order/${order}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch past order: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data;
}
