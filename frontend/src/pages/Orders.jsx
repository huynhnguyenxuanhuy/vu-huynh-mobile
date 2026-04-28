import { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";
import { resolveImageUrl } from "../utils/imageUrl";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data || []);
      } catch (error) {
        console.error("Lỗi lấy đơn hàng user:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <section className="section-space">
      <div className="container">
        <div className="section-head">
          <div>
            <h2 className="page-title">Đơn hàng của tôi</h2>
            <p className="section-subtitle">
              Theo dõi lịch sử đặt hàng của tài khoản
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="item-box">
            <p className="empty">Bạn chưa có đơn hàng nào.</p>
          </div>
        ) : (
          <div className="list">
            {orders.map((order) => (
              <div key={order._id} className="item-box">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                    marginBottom: 16,
                    paddingBottom: 14,
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 900,
                        color: "#0f172a",
                        marginBottom: 8,
                        wordBreak: "break-all",
                      }}
                    >
                      Mã đơn: {order._id}
                    </h3>

                    <p style={{ color: "#64748b", fontSize: 14 }}>
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`status-badge status-${order.status || "pending"}`}
                    >
                      {order.status || "pending"}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 16,
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: 18,
                      padding: 16,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 900,
                        color: "#64748b",
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Người nhận
                    </p>
                    <p style={{ fontWeight: 700, lineHeight: 1.6 }}>
                      {order.shippingInfo?.fullName || "Chưa có"}
                    </p>
                  </div>

                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: 18,
                      padding: 16,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 900,
                        color: "#64748b",
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Số điện thoại
                    </p>
                    <p style={{ fontWeight: 700, lineHeight: 1.6 }}>
                      {order.shippingInfo?.phone || "Chưa có"}
                    </p>
                  </div>

                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: 18,
                      padding: 16,
                      gridColumn: "1 / -1",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 900,
                        color: "#64748b",
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Địa chỉ giao hàng
                    </p>
                    <p style={{ fontWeight: 700, lineHeight: 1.6 }}>
                      {order.shippingInfo?.address || "Chưa có"}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 900,
                      color: "#64748b",
                      marginBottom: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Sản phẩm trong đơn
                  </p>

                  <div className="admin-product-list">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <div key={index} className="admin-product-item">
                          <div className="admin-product-item-left">
                            <div className="admin-product-thumb">
                              <img
                                src={resolveImageUrl(item.image)}
                                alt={item.name || "Product"}
                              />
                            </div>

                            <div>
                              <p className="admin-product-name">
                                {item.name || "Không có tên sản phẩm"}
                              </p>
                              <p className="admin-product-sub">
                                Số lượng: {item.qty || 1}
                              </p>
                            </div>
                          </div>

                          <div className="admin-product-price">
                            {((item.price || 0) * (item.qty || 1)).toLocaleString()} đ
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="empty">Không có sản phẩm trong đơn.</p>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                    paddingTop: 14,
                    borderTop: "1px solid #e2e8f0",
                  }}
                >
                  <span
                    style={{
                      padding: "10px 14px",
                      borderRadius: 999,
                      background: "#eef2ff",
                      color: "#334155",
                      fontSize: 13,
                      fontWeight: 800,
                    }}
                  >
                    {order.items?.length || 0} sản phẩm
                  </span>

                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 900,
                      color: "#dc2626",
                    }}
                  >
                    {(order.totalPrice || 0).toLocaleString()} đ
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
