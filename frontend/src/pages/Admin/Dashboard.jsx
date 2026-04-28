import { useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../services/productService";
import {
  deleteAdminOrder,
  getAdminDashboard,
  getAdminOrders,
  getAdminUsers,
} from "../../services/orderService";
import { FALLBACK_PRODUCT_IMAGE, resolveImageUrl } from "../../utils/imageUrl";

const initialForm = {
  name: "",
  price: "",
  image: "",
  description: "",
  brand: "",
  countInStock: "",
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    usersCount: 0,
    productsCount: 0,
    ordersCount: 0,
    revenue: 0,
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [productSaving, setProductSaving] = useState(false);
  const [productMessage, setProductMessage] = useState({ type: "", text: "" });
  const [loadingDeleteId, setLoadingDeleteId] = useState("");
  const [loadingProductDeleteId, setLoadingProductDeleteId] = useState("");

  const [productKeyword, setProductKeyword] = useState("");
  const [orderKeyword, setOrderKeyword] = useState("");
  const [userKeyword, setUserKeyword] = useState("");

  const fetchDashboard = async () => {
    try {
      const res = await getAdminDashboard();
      setStats({
        usersCount: res.data?.usersCount || res.data?.totalUsers || 0,
        productsCount: res.data?.productsCount || res.data?.totalProducts || 0,
        ordersCount: res.data?.ordersCount || res.data?.totalOrders || 0,
        revenue: res.data?.revenue || res.data?.totalRevenue || 0,
      });
    } catch (error) {
      console.error("Lỗi lấy dashboard admin:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await getAdminOrders();
      setOrders(res.data || []);
    } catch (error) {
      console.error("Lỗi lấy đơn hàng admin:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getAdminUsers();
      setUsers(res.data || []);
    } catch (error) {
      console.error("Lỗi lấy users admin:", error);
    }
  };

  const reloadAll = async () => {
    await Promise.all([
      fetchDashboard(),
      fetchProducts(),
      fetchOrders(),
      fetchUsers(),
    ]);
  };

  useEffect(() => {
    reloadAll();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImagePreview(form.image ? resolveImageUrl(form.image) : "");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setProductMessage({ type: "error", text: "Vui lòng chọn đúng file ảnh." });
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setProductMessage({ type: "", text: "" });
  };

  const buildProductFormData = () => {
    const data = new FormData();

    data.append("name", form.name.trim());
    data.append("price", Number(form.price || 0));
    data.append("description", form.description.trim());
    data.append("brand", form.brand.trim());
    data.append("countInStock", Number(form.countInStock || 0));
    data.append("image", form.image.trim());

    if (imageFile) {
      data.append("imageFile", imageFile);
    }

    return data;
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setProductMessage({ type: "error", text: "Vui lòng nhập tên sản phẩm." });
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setProductMessage({ type: "error", text: "Giá sản phẩm không hợp lệ." });
      return;
    }

    try {
      setProductSaving(true);
      setProductMessage({ type: "", text: "" });

      if (editingId) {
        await updateProduct(editingId, buildProductFormData());
        setProductMessage({ type: "success", text: "Cập nhật sản phẩm thành công." });
      } else {
        await createProduct(buildProductFormData());
        setProductMessage({ type: "success", text: "Thêm sản phẩm thành công." });
      }

      setForm(initialForm);
      setImageFile(null);
      setImagePreview("");
      setEditingId(null);
      await reloadAll();
    } catch (error) {
      console.error("Lỗi lưu sản phẩm:", error);
      setProductMessage({
        type: "error",
        text: error?.response?.data?.message || "Lưu sản phẩm thất bại.",
      });
    } finally {
      setProductSaving(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      price: product.price || "",
      image: product.image || "",
      description: product.description || "",
      brand: product.brand || "",
      countInStock: product.countInStock || "",
    });
    setImageFile(null);
    setImagePreview(product.image ? resolveImageUrl(product.image) : "");
    setProductMessage({ type: "", text: "" });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleResetForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setImageFile(null);
    setImagePreview("");
    setProductMessage({ type: "", text: "" });
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa sản phẩm này không?");
    if (!confirmDelete) return;

    try {
      setLoadingProductDeleteId(id);
      await deleteProduct(id);
      alert("Xóa sản phẩm thành công");
      await reloadAll();
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      alert(error?.response?.data?.message || "Xóa sản phẩm thất bại");
    } finally {
      setLoadingProductDeleteId("");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa đơn hàng này không?");
    if (!confirmDelete) return;

    try {
      setLoadingDeleteId(orderId);
      await deleteAdminOrder(orderId);
      alert("Xóa đơn hàng thành công");
      await reloadAll();
    } catch (error) {
      console.error("Lỗi xóa đơn hàng:", error);
      alert(error?.response?.data?.message || "Xóa đơn hàng thất bại");
    } finally {
      setLoadingDeleteId("");
    }
  };

  const filteredProducts = useMemo(() => {
    const keyword = productKeyword.trim().toLowerCase();
    if (!keyword) return products;

    return products.filter((product) => {
      return (
        String(product.name || "").toLowerCase().includes(keyword) ||
        String(product.brand || "").toLowerCase().includes(keyword) ||
        String(product.description || "").toLowerCase().includes(keyword)
      );
    });
  }, [products, productKeyword]);

  const filteredOrders = useMemo(() => {
    const keyword = orderKeyword.trim().toLowerCase();
    if (!keyword) return orders;

    return orders.filter((order) => {
      return (
        String(order._id || "").toLowerCase().includes(keyword) ||
        String(order.user?.name || "").toLowerCase().includes(keyword) ||
        String(order.user?.email || "").toLowerCase().includes(keyword) ||
        String(order.shippingInfo?.fullName || "").toLowerCase().includes(keyword) ||
        String(order.shippingInfo?.phone || "").toLowerCase().includes(keyword) ||
        String(order.shippingInfo?.address || "").toLowerCase().includes(keyword)
      );
    });
  }, [orders, orderKeyword]);

  const filteredUsers = useMemo(() => {
    const keyword = userKeyword.trim().toLowerCase();
    if (!keyword) return users;

    return users.filter((user) => {
      return (
        String(user.name || "").toLowerCase().includes(keyword) ||
        String(user.email || "").toLowerCase().includes(keyword)
      );
    });
  }, [users, userKeyword]);

  const totalStock = useMemo(() => {
    return products.reduce((sum, product) => sum + Number(product.countInStock || 0), 0);
  }, [products]);

  return (
    <section className="section-space">
      <div className="container">
        <div className="admin-head">
          <span className="admin-kicker">ADMIN PANEL</span>
          <h2 className="page-title">Quản trị hệ thống</h2>
          <p className="section-subtitle">
            Một trang duy nhất để quản lý tổng quan, sản phẩm, người dùng và đơn hàng
          </p>
        </div>

        <div className="stats">
          <div className="stat-card">
            <h3>Tổng người dùng</h3>
            <p>{stats.usersCount}</p>
          </div>

          <div className="stat-card">
            <h3>Tổng sản phẩm</h3>
            <p>{stats.productsCount}</p>
          </div>

          <div className="stat-card">
            <h3>Tổng đơn hàng</h3>
            <p>{stats.ordersCount}</p>
          </div>

          <div className="stat-card">
            <h3>Tổng doanh thu</h3>
            <p>{Number(stats.revenue || 0).toLocaleString()} đ</p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18,
            marginBottom: 28,
          }}
        >
          <div className="stat-card">
            <h3>Đang hiển thị</h3>
            <p>{products.length}</p>
          </div>

          <div className="stat-card">
            <h3>Tổng tồn kho</h3>
            <p>{totalStock}</p>
          </div>

          <div className="stat-card">
            <h3>Đơn đang có</h3>
            <p>{orders.length}</p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: 28,
          }}
        >
          <div className="admin-empty-card">
            <div className="admin-head" style={{ marginBottom: 18 }}>
              <span className="admin-kicker">SẢN PHẨM</span>
              <h2 className="page-title">
                {editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h2>
              <p className="section-subtitle">
                Admin có thể đăng sản phẩm, tải ảnh từ thiết bị, sửa giá, mô tả và tồn kho
              </p>
            </div>

            <form onSubmit={handleSubmitProduct}>
              {productMessage.text && (
                <div
                  className={`admin-form-alert ${
                    productMessage.type === "success"
                      ? "admin-form-alert-success"
                      : "admin-form-alert-error"
                  }`}
                >
                  {productMessage.text}
                </div>
              )}

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label>Tên sản phẩm</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ví dụ: iPhone 15 Pro Max"
                      required
                    />
                  </div>
                </div>

                <div className="col">
                  <div className="form-group">
                    <label>Giá</label>
                    <input
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="Nhập giá sản phẩm"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label>Ảnh sản phẩm</label>
                    <div className="admin-upload-box">
                      <div className="admin-upload-preview">
                        {imagePreview || form.image ? (
                          <img
                            src={imagePreview || resolveImageUrl(form.image)}
                            alt="Xem trước ảnh sản phẩm"
                          />
                        ) : (
                          <span>Chưa chọn ảnh</span>
                        )}
                      </div>

                      <div className="admin-upload-actions">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <small>
                          Chọn ảnh từ máy tính để sản phẩm hiển thị chuyên nghiệp hơn.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col">
                  <div className="form-group">
                    <label>Hãng</label>
                    <input
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}
                      placeholder="Ví dụ: Apple, Samsung, Xiaomi"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label>Tồn kho</label>
                    <input
                      name="countInStock"
                      value={form.countInStock}
                      onChange={handleChange}
                      placeholder="Số lượng tồn kho"
                    />
                  </div>
                </div>

                <div className="col">
                  <div className="form-group">
                    <label>Mô tả</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Mô tả ngắn về sản phẩm"
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginTop: 10,
                }}
              >
                <button className="btn btn-primary" type="submit" disabled={productSaving}>
                  {productSaving
                    ? "Đang lưu..."
                    : editingId
                    ? "Cập nhật sản phẩm"
                    : "Thêm sản phẩm"}
                </button>

                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={handleResetForm}
                >
                  Làm mới form
                </button>
              </div>
            </form>
          </div>

          <div className="admin-empty-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <div>
                <span className="admin-kicker">DANH SÁCH SẢN PHẨM</span>
                <h2 className="page-title">Quản lý sản phẩm</h2>
                <p className="section-subtitle">
                  Sửa, xóa nhanh sản phẩm hiện có
                </p>
              </div>

              <div style={{ minWidth: 280, flex: 1, maxWidth: 420 }}>
                <input
                  value={productKeyword}
                  onChange={(e) => setProductKeyword(e.target.value)}
                  placeholder="Tìm theo tên, hãng, mô tả..."
                  style={{
                    width: "100%",
                    border: "1px solid #dbe3ef",
                    background: "#f8fbff",
                    borderRadius: 14,
                    padding: "13px 14px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Giá</th>
                    <th>Hãng</th>
                    <th>Tồn kho</th>
                    <th>Ảnh</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{Number(product.price || 0).toLocaleString()} đ</td>
                      <td>{product.brand || "Chưa có"}</td>
                      <td>{product.countInStock || 0}</td>
                      <td>
                        {product.image ? (
                          <img
                            src={resolveImageUrl(product.image)}
                            alt={product.name}
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                            }}
                            style={{
                              width: 62,
                              height: 62,
                              objectFit: "cover",
                              borderRadius: 12,
                              border: "1px solid #e2e8f0",
                            }}
                          />
                        ) : (
                          "Không có"
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={() => handleEditProduct(product)}
                          >
                            Sửa
                          </button>

                          <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() => handleDeleteProduct(product._id)}
                            disabled={loadingProductDeleteId === product._id}
                          >
                            {loadingProductDeleteId === product._id
                              ? "Đang xóa..."
                              : "Xóa"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="6">
                        <p className="empty">Không có sản phẩm phù hợp.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-empty-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <div>
                <span className="admin-kicker">NGƯỜI DÙNG</span>
                <h2 className="page-title">Quản lý người dùng</h2>
                <p className="section-subtitle">
                  Xem danh sách tài khoản đã đăng ký
                </p>
              </div>

              <div style={{ minWidth: 280, flex: 1, maxWidth: 420 }}>
                <input
                  value={userKeyword}
                  onChange={(e) => setUserKeyword(e.target.value)}
                  placeholder="Tìm theo tên hoặc email..."
                  style={{
                    width: "100%",
                    border: "1px solid #dbe3ef",
                    background: "#f8fbff",
                    borderRadius: 14,
                    padding: "13px 14px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name || "Chưa có"}</td>
                      <td>{user.email || "Chưa có"}</td>
                      <td>{user.isAdmin ? "Admin" : "User"}</td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="3">
                        <p className="empty">Không có người dùng phù hợp.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-empty-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <div>
                <span className="admin-kicker">ĐƠN HÀNG</span>
                <h2 className="page-title">Quản lý đơn hàng</h2>
                <p className="section-subtitle">
                  Xem chi tiết và xóa đơn hàng ngay trong một trang
                </p>
              </div>

              <div style={{ minWidth: 280, flex: 1, maxWidth: 420 }}>
                <input
                  value={orderKeyword}
                  onChange={(e) => setOrderKeyword(e.target.value)}
                  placeholder="Tìm theo mã đơn, user, email, số điện thoại..."
                  style={{
                    width: "100%",
                    border: "1px solid #dbe3ef",
                    background: "#f8fbff",
                    borderRadius: 14,
                    padding: "13px 14px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <p className="empty">Chưa có đơn hàng nào.</p>
            ) : (
              <div className="admin-orders-grid">
                {filteredOrders.map((order) => (
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
                                      src={resolveImageUrl(item.image)}
                                      alt={item.name || "Sản phẩm"}
                                      onError={(e) => {
                                        e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                                      }}
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
                                  {Number(
                                    (item.price || 0) * (item.qty || 1)
                                  ).toLocaleString()}{" "}
                                  đ
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
                          {loadingDeleteId === order._id
                            ? "Đang xóa..."
                            : "Xóa đơn"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
