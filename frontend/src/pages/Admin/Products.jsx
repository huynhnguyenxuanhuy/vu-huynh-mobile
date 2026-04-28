import { useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../services/productService";
import { FALLBACK_PRODUCT_IMAGE, resolveImageUrl } from "../../utils/imageUrl";

const initialForm = {
  name: "",
  price: "",
  image: "",
  description: "",
  brand: "",
  countInStock: "",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setPageLoading(true);
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error("Lỗi lấy sản phẩm:", err);
      setError("Không tải được danh sách sản phẩm");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const text = `${product.name || ""} ${product.brand || ""} ${product.description || ""}`.toLowerCase();
      return text.includes(keyword.toLowerCase());
    });
  }, [products, keyword]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImagePreview(form.image ? resolveImageUrl(form.image) : "");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn đúng file ảnh");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm(initialForm);
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Vui lòng nhập tên sản phẩm");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError("Giá sản phẩm không hợp lệ");
      return;
    }

    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("image", form.image.trim());
    payload.append("description", form.description.trim());
    payload.append("brand", form.brand.trim());
    payload.append("price", Number(form.price));
    payload.append("countInStock", Number(form.countInStock) || 0);

    if (imageFile) {
      payload.append("imageFile", imageFile);
    }

    try {
      setLoading(true);

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      resetForm();
      await fetchProducts();
    } catch (err) {
      console.error("Lỗi lưu sản phẩm:", err);
      setError(err.response?.data?.message || "Lưu sản phẩm thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?");
    if (!ok) return;

    try {
      setError("");
      await deleteProduct(id);
      await fetchProducts();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
      setError(err.response?.data?.message || "Xóa sản phẩm thất bại");
    }
  };

  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum, product) => sum + (Number(product.countInStock) || 0),
    0
  );

  return (
    <section className="section-space">
      <div className="container">
        <div className="section-head admin-head">
          <div>
            <p className="admin-kicker">ADMIN PANEL</p>
            <h2 className="page-title">Quản lý sản phẩm</h2>
            <p className="section-subtitle">
              Thêm, sửa, xóa sản phẩm và quản lý tồn kho
            </p>
          </div>
        </div>

        <div className="stats" style={{ marginBottom: 24 }}>
          <div className="stat-card">
            <h3>Tổng sản phẩm</h3>
            <p>{totalProducts}</p>
          </div>

          <div className="stat-card">
            <h3>Tổng tồn kho</h3>
            <p>{totalStock}</p>
          </div>

          <div className="stat-card">
            <h3>Đang hiển thị</h3>
            <p>{filteredProducts.length}</p>
          </div>
        </div>

        <div className="admin-empty-card" style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <div>
              <h3 style={{ fontSize: 24, marginBottom: 6 }}>
                {editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h3>
              <p className="section-subtitle">
                Điền đầy đủ thông tin để lưu sản phẩm vào hệ thống
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Hủy chỉnh sửa
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  marginBottom: 16,
                  padding: "12px 14px",
                  borderRadius: 14,
                  background: "#fef2f2",
                  color: "#b91c1c",
                  fontWeight: 700,
                  border: "1px solid #fecaca",
                }}
              >
                {error}
              </div>
            )}

            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label>Tên sản phẩm</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ví dụ: iPhone 15 Pro Max"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col">
                <div className="form-group">
                  <label>Giá</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Nhập giá sản phẩm"
                    value={form.price}
                    onChange={handleChange}
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
                      <small>Chọn ảnh trực tiếp từ thiết bị của admin.</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="form-group">
                  <label>Hãng</label>
                  <input
                    type="text"
                    name="brand"
                    placeholder="Ví dụ: Apple, Samsung, Xiaomi"
                    value={form.brand}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label>Tồn kho</label>
                  <input
                    type="number"
                    name="countInStock"
                    placeholder="Số lượng tồn kho"
                    value={form.countInStock}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col">
                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    name="description"
                    placeholder="Mô tả ngắn về sản phẩm"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 6,
              }}
            >
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading
                  ? "Đang lưu..."
                  : editingId
                  ? "Cập nhật sản phẩm"
                  : "Thêm sản phẩm"}
              </button>

              <button
                className="btn btn-secondary"
                type="button"
                onClick={resetForm}
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
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <div>
              <h3 style={{ fontSize: 24, marginBottom: 6 }}>Danh sách sản phẩm</h3>
              <p className="section-subtitle">
                Quản lý nhanh toàn bộ sản phẩm đang có
              </p>
            </div>

            <div style={{ minWidth: 280, flex: 1, maxWidth: 380 }}>
              <input
                type="text"
                placeholder="Tìm theo tên, hãng, mô tả..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
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

          {pageLoading ? (
            <p className="empty">Đang tải sản phẩm...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="empty">Không có sản phẩm phù hợp.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gap: 18,
              }}
            >
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="item-box"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "160px 1fr auto",
                    gap: 18,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 130,
                      borderRadius: 18,
                      overflow: "hidden",
                      background: "#eef2ff",
                    }}
                  >
                    <img
                      src={
                        resolveImageUrl(product.image)
                      }
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: 22,
                        fontWeight: 900,
                        color: "#0f172a",
                        marginBottom: 10,
                      }}
                    >
                      {product.name}
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                        marginBottom: 12,
                      }}
                    >
                      <span className="brand-badge">
                        {product.brand || "Chưa có hãng"}
                      </span>

                      <span className="brand-badge">
                        Tồn kho: {product.countInStock || 0}
                      </span>
                    </div>

                    <p
                      style={{
                        color: "#64748b",
                        lineHeight: 1.7,
                        marginBottom: 10,
                      }}
                    >
                      {product.description || "Chưa có mô tả sản phẩm"}
                    </p>

                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 900,
                        color: "#dc2626",
                      }}
                    >
                      {(product.price || 0).toLocaleString()} đ
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      minWidth: 120,
                    }}
                  >
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => handleEdit(product)}
                    >
                      Sửa
                    </button>

                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={() => handleDelete(product._id)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .admin-product-card-mobile {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
