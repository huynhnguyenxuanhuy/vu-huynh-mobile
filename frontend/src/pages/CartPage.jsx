import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";
import { resolveImageUrl } from "../utils/imageUrl";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );

  const handleChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = async () => {
    try {
      if (cartItems.length === 0) {
        alert("Giỏ hàng đang trống");
        return;
      }

      if (!shippingInfo.fullName.trim()) {
        alert("Vui lòng nhập họ tên người nhận");
        return;
      }

      if (!shippingInfo.phone.trim()) {
        alert("Vui lòng nhập số điện thoại");
        return;
      }

      if (!shippingInfo.address.trim()) {
        alert("Vui lòng nhập địa chỉ");
        return;
      }

      const items = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty || 1,
      }));

      await createOrder({
        items,
        totalPrice,
        shippingInfo,
      });

      alert("Đặt hàng thành công");
      clearCart();
      setShippingInfo({
        fullName: "",
        phone: "",
        address: "",
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Đặt hàng thất bại");
    }
  };

  return (
    <section className="section-space">
      <div className="container">
        <div className="section-head">
          <div>
            <h2 className="page-title">Giỏ hàng của bạn</h2>
            <p className="section-subtitle">
              Kiểm tra sản phẩm và điền thông tin nhận hàng
            </p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="item-box">
            <p className="empty">Chưa có sản phẩm nào trong giỏ hàng.</p>
            <Link to="/" className="btn btn-primary">
              Mua ngay
            </Link>
          </div>
        ) : (
          <div className="row">
            <div className="col" style={{ flex: 2 }}>
              <div className="list">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="item-box"
                    style={{
                      display: "flex",
                      gap: 18,
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{ display: "flex", gap: 16, alignItems: "center" }}
                    >
                      <img
                        src={resolveImageUrl(item.image)}
                        alt={item.name}
                        style={{
                          width: 110,
                          height: 110,
                          objectFit: "cover",
                          borderRadius: 14,
                        }}
                      />
                      <div>
                        <h3 style={{ fontSize: 20, marginBottom: 8 }}>
                          {item.name}
                        </h3>
                        <p style={{ color: "#64748b", marginBottom: 8 }}>
                          {item.brand}
                        </p>
                        <p className="price" style={{ marginBottom: 0 }}>
                          {(item.price || 0).toLocaleString()} đ
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span
                        style={{
                          padding: "10px 14px",
                          borderRadius: 12,
                          background: "#eef2ff",
                          fontWeight: 700,
                        }}
                      >
                        SL: {item.qty || 1}
                      </span>

                      <button
                        className="btn btn-danger"
                        onClick={() => removeFromCart(item._id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="item-box" style={{ marginTop: 18 }}>
                <h3 style={{ fontSize: 24, marginBottom: 18 }}>
                  Thông tin nhận hàng
                </h3>

                <div className="form-group">
                  <label>Họ tên người nhận</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Nhập họ tên người nhận"
                    value={shippingInfo.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Nhập số điện thoại"
                    value={shippingInfo.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Địa chỉ giao hàng</label>
                  <textarea
                    name="address"
                    placeholder="Nhập địa chỉ cụ thể"
                    value={shippingInfo.address}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>
              </div>
            </div>

            <div className="col" style={{ flex: 1 }}>
              <div className="item-box">
                <h3 style={{ fontSize: 24, marginBottom: 18 }}>
                  Tóm tắt đơn hàng
                </h3>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                    color: "#475569",
                  }}
                >
                  <span>Số sản phẩm</span>
                  <strong>{cartItems.length}</strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 18,
                    fontSize: 22,
                    fontWeight: 900,
                  }}
                >
                  <span>Tổng tiền</span>
                  <span style={{ color: "#dc2626" }}>
                    {totalPrice.toLocaleString()} đ
                  </span>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: "100%", marginBottom: 10 }}
                  onClick={handleCheckout}
                >
                  Đặt hàng ngay
                </button>

                <button
                  className="btn btn-secondary"
                  style={{ width: "100%" }}
                  onClick={clearCart}
                >
                  Xóa toàn bộ giỏ hàng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
