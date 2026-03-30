import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, removeFromCart } = useCart();

  return (
    <div className="list">
      {cartItems.map((item) => (
        <div
          key={item._id}
          className="item-box"
          style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
        >
          <div>
            <h4>{item.name}</h4>
            <p>{item.price.toLocaleString()} đ</p>
          </div>
          <button className="btn btn-danger" onClick={() => removeFromCart(item._id)}>
            Xóa
          </button>
        </div>
      ))}
    </div>
  );
}