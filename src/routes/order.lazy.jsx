import { useContext, useEffect, useState } from "react";
import Pizza from "../Pizza";
import { Cart } from "../Cart";
import { CartContext } from "../CartContext";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useLoading } from "../LoadingContext";

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
  const [pizzas, setPizzas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [cart, setCart] = useContext(CartContext);
  const { setLoading, removeLoading } = useLoading();

  let selectedPizza, price;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pizza-type") {
      setPizzaType(value);
    } else if (name === "pizza-size") {
      setPizzaSize(value);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    let isActive = true; // Flag to track if component is still mounted

    async function fetchPizzaTypes() {
      setLoading("pizzas", true);
      try {
        const pizzaRes = await fetch("/api/pizzas", {
          signal: abortController.signal,
        });

        if (!pizzaRes.ok) {
          throw new Error(`HTTP error! status: ${pizzaRes.status}`);
        }

        const pizzaJson = await pizzaRes.json();
        
        // Only update state if component is still active
        if (isActive) {
          setPizzas(pizzaJson);
          setIsLoading(false);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch pizzas:", error);
          if (isActive) {
            setIsLoading(false);
          }
        }
        // For AbortError, don't update state since component is unmounting
      } finally {
        setLoading("pizzas", false); // Always clean up global loading state
      }
    }

    fetchPizzaTypes();

    // Cleanup function
    return () => {
      isActive = false; // Mark component as inactive
      abortController.abort();
      removeLoading("pizzas");
    };
  }, []); // Empty dependencies to prevent infinite loop

  const handleSubmit = (e) => {
    e.preventDefault();
    setCart([...cart, { pizza: selectedPizza, size: pizzaSize, price }]);
  };

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
