import { useState } from "react";
import Pizza from "./Pizza";

const pizzas = [
  {
    value: "pepperoni",
    viewValue: "The Pepperoni Pizza",
  },
  {
    value: "hawaiian",
    viewValue: "The Hawaiian Pizza",
  },
  {
    value: "big_meat",
    viewValue: "The Big Meat Pizza",
  },
];

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
  const [pizzaType, setPizzaType] = useState("pepperoni");
  const [pizzaSize, setPizzaSize] = useState("M");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pizza-type") {
      setPizzaType(value);
    } else if (name === "pizza-size") {
      setPizzaSize(value);
    }
  };

  return (
    <div className="order">
      <h2>Create Order</h2>
      <form>
        <div onChange={handleChange}>
          <div>
            <label htmlFor="pizza-type">Pizza Type</label>
            <select name="pizza-type" value={pizzaType}>
              {pizzas.map((pizza) => (
                <option key={pizza.value} value={pizza.value}>
                  {pizza.viewValue}
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
                    checked={pizzaSize === size.value}
                    type="radio"
                    name="pizza-size"
                    value={size.value}
                    id={size.id}
                  />
                  <label htmlFor={size.id}>{size.viewValue}</label>
                </span>
              ))}
            </div>
          </div>
          <button type="submit">Add to Cart</button>
        </div>
        <div className="order-pizza">
          <Pizza
            name="Pepperoni"
            description="Mozzarella Cheese, Pepperoni"
            image="/public/pizzas/pepperoni.webp"
          />
          <p>$13.37</p>
        </div>
      </form>
    </div>
  );
}
