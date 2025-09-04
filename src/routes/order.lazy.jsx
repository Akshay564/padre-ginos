import { useContext, useState } from "react";
import Pizza from "../Pizza";
import { Cart } from "../Cart";
import { CartContext } from "../CartContext";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "../useQuery";
import getPizzas from "../api/getPizzas";

export const Route = createLazyFileRoute("/order")({
  component: Order,
});

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const pizzaSizes = [
  {
    value: "S",
    viewValue: "Small",
    id: "pizza-s",
  },
  {
    value: "M",
    viewValue: "Medium",
    id: "pizza-m",
  },
  {
    value: "L",
    viewValue: "Large",
    id: "pizza-l",
  },
];

function Order() {
  const [pizzaType, setPizzaType] = useState("bbq_ckn");
  const [pizzaSize, setPizzaSize] = useState("M");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [cart, setCart] = useContext(CartContext);

  // Use React Query to fetch pizzas - loading handled automatically by QueryGlobalLoader
  const {
    data: pizzas = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pizzas"],
    queryFn: ({ signal }) => getPizzas({ signal }),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  let selectedPizza, price;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pizza-type") {
      setPizzaType(value);
    } else if (name === "pizza-size") {
      setPizzaSize(value);
    }
  };

  // Calculate selected pizza and price
  if (!isLoading && pizzas.length > 0) {
    selectedPizza = pizzas.find((p) => p.id === pizzaType);
    price = selectedPizza?.sizes[pizzaSize];
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setCart([...cart, { pizza: selectedPizza, size: pizzaSize, price }]);
  };

  // Show error state if pizza fetch fails
  if (isError) {
    return (
      <div className="order-page">
        <h2>Error loading pizzas</h2>
        <p>{error?.message || "Something went wrong"}</p>
      </div>
    );
  }

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
        setIsCheckingOut(false);
      }, 300);
    } catch (error) {
      console.error("Checkout failed:", error);
      setIsCheckingOut(false);
    }
  }

  if (!isLoading && pizzas.length > 0) {
    selectedPizza = pizzas.find((p) => p.id === pizzaType);
    price = selectedPizza?.sizes[pizzaSize];
  }

  return (
    <div className="order-page">
      <div className="order">
        <h2>Create Order</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <label htmlFor="pizza-type">Pizza Type</label>
              <select
                name="pizza-type"
                value={pizzaType}
                onChange={handleChange}
              >
                {pizzas.map((pizza) => (
                  <option key={pizza.id} value={pizza.id}>
                    {pizza.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="pizza-size">Pizza Size</label>
              <div>
                {pizzaSizes.map((size) => (
                  <span key={size.id}>
                    <input
                      type="radio"
                      name="pizza-size"
                      value={size.value}
                      id={size.id}
                      checked={pizzaSize === size.value}
                      onChange={handleChange}
                    />
                    <label htmlFor={size.id}>{size.viewValue}</label>
                  </span>
                ))}
              </div>
            </div>

            <button type="submit">Add to Cart</button>
          </div>

          {selectedPizza && (
            <div className="order-pizza">
              <Pizza
                name={selectedPizza.name}
                description={selectedPizza.description}
                image={selectedPizza.image}
              />
              <p>{intl.format(price)}</p>
            </div>
          )}
        </form>
      </div>
      <Cart checkout={checkout} cart={cart} isCheckingOut={isCheckingOut} />
    </div>
  );
}
