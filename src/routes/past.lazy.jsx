import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import getPastOrders from "../api/getPastOrders";

export const Route = createLazyFileRoute("/past")({
  component: PastOrders,
});

function PastOrders() {
  const [page, setPage] = useState(1);
  const { isFetching, isLoading, data } = useQuery({
    queryKey: ["past-orders", page],
    queryFn: () => getPastOrders(page),
    staleTime: 30000,
  });

  if (isLoading || isFetching) {
    return (
      <div className="past-orders">
        <h2>LOADING …</h2>
      </div>
    );
  }

  return (
    <div className="past-orders">
      <div style={{ padding: "25px 0" }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(data) ? data : []).map((order) => {
              return (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.date}</td>
                  <td>{order.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pages">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <div>{page}</div>
        <button disabled={data.length < 10} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
