import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import getPastOrders from "../api/getPastOrders";
import { useQuery } from "../useQuery";
import getPastOrderDetails from "../api/getPastOrderDetails";
import Modal from "../Modal";

export const Route = createLazyFileRoute("/past")({
  component: PastOrders,
});

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function PastOrders() {
  const [page, setPage] = useState(1);
  const [focusedOrder, setFocusedOrder] = useState();
  const { data, isError, error } = useQuery({
    queryKey: ["past-orders", page],
    queryFn: ({ signal }) => getPastOrders(page, { signal }),
    staleTime: 30000,
  });

  const { isLoading: isLoadingPastOrder, data: pastOrderData } = useQuery({
    queryKey: ["past-order", focusedOrder],
    queryFn: ({ signal }) => getPastOrderDetails(focusedOrder, { signal }),
    staleTime: 24 * 60 * 60 * 1000,
    enabled: !!focusedOrder,
    meta: {
      excludeFromGlobalLoader: true, // Mark this query to be excluded
    },
  });

  if (isError) {
    return (
      <div className="past-orders">
        <h2>Error loading past orders</h2>
        <p>{error?.message || "Something went wrong"}</p>
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
                  <td>
                    <button onClick={() => setFocusedOrder(order.order_id)}>
                      {order.order_id}
                    </button>
                  </td>
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
        <button
          disabled={!data || data.length < 10}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
      {focusedOrder ? (
        <Modal onClose={() => setFocusedOrder()}>
          <h2>Order #{focusedOrder}</h2>
          {!isLoadingPastOrder ? (
            <table>
              <thead>
                <tr>
                  <td>Image</td>
                  <td>Name</td>
                  <td>Size</td>
                  <td>Quantity</td>
                  <td>Price</td>
                  <td>Total</td>
                </tr>
              </thead>
              <tbody>
                {(pastOrderData?.orderItems ?? []).map((pizza) => (
                  <tr key={`${pizza.pizzaTypeId}_${pizza.size}`}>
                    <td>
                      <img src={pizza.image} alt={pizza.name} />
                    </td>
                    <td>{pizza.name}</td>
                    <td>{pizza.size}</td>
                    <td>{pizza.quantity}</td>
                    <td>{intl.format(pizza.price)}</td>
                    <td>{intl.format(pizza.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Loading...</p>
          )}
          <button onClick={() => setFocusedOrder(null)}>Close</button>
        </Modal>
      ) : null}
    </div>
  );
}
