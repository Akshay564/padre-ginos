import { useEffect, useState } from "react";
import Pizza from "./Pizza";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
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

export default function Order() {
  const [pizzaType, setPizzaType] = useState("bbq_ckn");
  const [pizzaSize, setPizzaSize] = useState("M");
  const [pizzas, setPizzas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  let selectedPizza, price;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pizza-type") {
      setPizzaType(value);
    } else if (name === "pizza-size") {
      setPizzaSize(value);
    }
  };

  async function fetchPizzaTypes() {
    const pizzaRes = await fetch("/api/pizzas");
    const pizzaJson = await pizzaRes.json();
    setPizzas(pizzaJson);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchPizzaTypes();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  if (!isLoading) {
    selectedPizza = pizzas.find((p) => p.id === pizzaType);
    price = selectedPizza.sizes[pizzaSize];
  }

  return (
    <div className="order">
      <h2>Create Order</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <label htmlFor="pizza-type">Pizza Type</label>
            <select name="pizza-type" value={pizzaType} onChange={handleChange}>
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
  );
}
