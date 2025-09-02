const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function Cart({ checkout, cart, isCheckingOut }) {
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
