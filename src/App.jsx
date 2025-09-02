import { createRoot } from "react-dom/client";
import Order from "./Order";
import { StrictMode, useState } from "react";
import PizzaOfTheDay from "./pizzaOfTheDay";
import { CartContext } from "./CartContext";
import Header from "./Header";

const App = () => {
  const cartHook = useState([]);
  return (
    <CartContext.Provider value={cartHook}>
      <div>
        <Header />
        <Order />
        <PizzaOfTheDay />
      </div>
    </CartContext.Provider>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
