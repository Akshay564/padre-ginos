import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useContext, useState } from "react";
import { CartContext } from "../CartContext";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const Route = createLazyFileRoute("/cart")({
  component: () => <Cart />,
});

function Cart() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [cart, setCart] = useContext(CartContext);
  const navigate = useNavigate();

  async function checkout() {
    setIsCheckingOut(true);

    try {
      await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
        }),
      });

      // Add a small delay to prevent jarring transition
      setTimeout(() => {
        setCart([]);
        navigate({
          to: "/",
        });
        setIsCheckingOut(false);
      }, 300);
    } catch (error) {
      console.error("Checkout failed:", error);
      setIsCheckingOut(false);
    }
  }

  let total = 0;

  for (let i = 0; i < cart.length; i++) {
    const current = cart[i];
    total += current.pizza.sizes[current.size];
  }

  return (
    <div className="cart">
      <h2>Cart</h2>
      {cart.length === 0 && !isCheckingOut ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                <span className="size">{item.size}</span> -
                <span className="type">{item.pizza.name}</span> -
                <span className="price">{intl.format(item.price)}</span>
              </li>
            ))}
          </ul>
          <p>Total: {intl.format(total)}</p>
          <button
            onClick={checkout}
            disabled={isCheckingOut || cart.length === 0}
          >
            {isCheckingOut ? "Processing..." : "Checkout"}
          </button>
        </>
      )}
    </div>
  );
}
