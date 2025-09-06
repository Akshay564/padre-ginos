import { useContext } from "react";
import { CartContext } from "./CartContext";
import { Link } from "@tanstack/react-router";

export default function Header() {
  const [cart] = useContext(CartContext);
  return (
    <nav>
      <Link to={"/"}>
        <h1 className="logo">Padre Gino's Pizza</h1>
      </Link>
      <Link to={"/cart"} className="nav-cart">
        🛒<span className="nav-cart-number">{cart.length}</span>
      </Link>
    </nav>
  );
}
