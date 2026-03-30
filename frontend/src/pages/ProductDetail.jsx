import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    alert("Đã thêm vào giỏ hàng");
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product);
    navigate("/cart");
  };

  if (loading) {
    return (
      <section className="section-space">
        <div className="container">
          <div className="item-box">
            <p className="empty">Đang tải sản phẩm...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="section-space">
        <div className="container">
          <div className="item-box">
            <p className="empty">Không tìm thấy sản phẩm.</p>
            <Link to="/" className="btn btn-primary">
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-space">
      <div className="container">
        <div
          className="item-box"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 1fr",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              overflow: "hidden",
              borderRadius: 26,
              background: "#eef2ff",
              minHeight: 420,
            }}
          >
            <img
              src={
                product.image ||
                "https://via.placeholder.com/900x700?text=No+Image"
              }
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "inline-flex",
                alignSelf: "flex-start",
                padding: "8px 14px",
                borderRadius: 999,
                background: "#eef2ff",
                color: "#334155",
                fontWeight: 800,
                marginBottom: 16,
              }}
            >
              {product.brand || "Chưa có hãng"}
            </div>

            <h1
              style={{
                fontSize: "clamp(30px, 4vw, 52px)",
                lineHeight: 1.08,
                fontWeight: 900,
                color: "#0f172a",
                marginBottom: 16,
              }}
            >
              {product.name}
            </h1>

            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: "#dc2626",
                marginBottom: 18,
              }}
            >
              {(product.price || 0).toLocaleString()} đ
            </div>

            <p
              style={{
                color: "#64748b",
                fontSize: 18,
                lineHeight: 1.8,
                marginBottom: 20,
              }}
            >
              {product.description || "Chưa có mô tả sản phẩm."}
            </p>

            <div
              style={{
                display: "grid",
                gap: 12,
                marginBottom: 24,
                color: "#334155",
                fontSize: 17,
                fontWeight: 700,
              }}
            >
              <div>Tình trạng: Chính hãng mới 100%</div>
              <div>Tồn kho: {product.countInStock || 0}</div>
              <div>Bảo hành: 12 tháng</div>
              <div>Hỗ trợ trả góp: Có</div>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={handleAddToCart}>
                Thêm vào giỏ hàng
              </button>

              <button className="btn btn-secondary" onClick={handleBuyNow}>
                Mua ngay
              </button>

              <Link to="/cart" className="btn btn-secondary">
                Xem giỏ hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}