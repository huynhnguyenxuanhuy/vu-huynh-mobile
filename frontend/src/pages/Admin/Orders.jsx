import { useEffect, useState } from "react";
import {
  deleteAdminOrder,
  getAdminOrders,
} from "../../services/orderService";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loadingDeleteId, setLoadingDeleteId] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await getAdminOrders();
      setOrders(res.data || []);
    } catch (error) {
      console.error("Lỗi lấy đơn hàng admin:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa đơn hàng này không?"
    );

    if (!confirmDelete) return;

    try {
      setLoadingDeleteId(orderId);
      await deleteAdminOrder(orderId);
      await fetchOrders();
      alert("Xóa đơn hàng thành công");
    } catch (error) {
      console.error("Lỗi xóa đơn hàng:", error);
      alert(error?.response?.data?.message || "Xóa đơn hàng thất bại");
    } finally {
      setLoadingDeleteId("");
    }
  };

  return (
    <div>
      <div className="admin-head">
        <span className="admin-kicker">ADMIN PANEL</span>
        <h2 className="page-title">Quản lý đơn hàng</h2>
        <p className="section-subtitle">
          Theo dõi đơn hàng, người nhận và thông tin giao hàng
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty-card">
          <p className="empty">Chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="admin-orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="admin-order-card">
              <div className="admin-order-top">
                <div>
                  <p className="admin-order-label">Mã đơn</p>
                  <h3 className="admin-order-id">{order._id}</h3>
                </div>

                <div className="admin-order-top-right">
                  <span
                    className={`status-badge status-${order.status || "pending"}`}
                  >
                    {order.status || "pending"}
                  </span>

                  <div className="admin-order-total">
                    {Number(order.totalPrice || 0).toLocaleString()} đ
                  </div>
                </div>
              </div>

              <div className="admin-order-body">
                <div className="admin-info-box">
                  <p className="admin-order-label">Khách hàng</p>
                  <p className="admin-order-value">
                    {order.user?.name || "Không rõ"}
                  </p>
                </div>

                <div className="admin-info-box">
                  <p className="admin-order-label">Email</p>
                  <p className="admin-order-value admin-break">
                    {order.user?.email || "Không rõ"}
                  </p>
                </div>

                <div className="admin-info-box">
                  <p className="admin-order-label">Người nhận</p>
                  <p className="admin-order-value">
                    {order.shippingInfo?.fullName || "Chưa có"}
                  </p>
                </div>

                <div className="admin-info-box">
                  <p className="admin-order-label">Số điện thoại</p>
                  <p className="admin-order-value">
                    {order.shippingInfo?.phone || "Chưa có"}
                  </p>
                </div>

                <div className="admin-info-box admin-info-box-wide">
                  <p className="admin-order-label">Địa chỉ giao hàng</p>
                  <p className="admin-order-value admin-break">
                    {order.shippingInfo?.address || "Chưa có"}
                  </p>
                </div>

                <div className="admin-info-box admin-info-box-wide">
                  <p className="admin-order-label">Sản phẩm trong đơn</p>

                  <div className="admin-product-list">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <div key={index} className="admin-product-item">
                          <div className="admin-product-item-left">
                            <div className="admin-product-thumb">
                              <img
                                src={
                                  item.image ||
                                  "https://via.placeholder.com/80x80?text=No+Image"
                                }
                                alt={item.name || "Sản phẩm"}
                              />
                            </div>

                            <div>
                              <p className="admin-product-name">
                                {item.name || "Đơn cũ chưa có tên sản phẩm"}
                              </p>
                              <p className="admin-product-sub">
                                Số lượng: {item.qty || 1}
                              </p>
                              <p className="admin-product-sub">
                                Đơn giá: {Number(item.price || 0).toLocaleString()} đ
                              </p>
                            </div>
                          </div>

                          <div className="admin-product-price">
                            {Number((item.price || 0) * (item.qty || 1)).toLocaleString()} đ
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="empty">Không có sản phẩm trong đơn.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="admin-order-footer">
                <div className="admin-meta-list">
                  <span className="admin-meta-chip">
                    {order.items?.length || 0} sản phẩm
                  </span>
                  <span className="admin-meta-chip">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "flex-end",
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => handleDeleteOrder(order._id)}
                    disabled={loadingDeleteId === order._id}
                  >
                    {loadingDeleteId === order._id ? "Đang xóa..." : "Xóa đơn"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}