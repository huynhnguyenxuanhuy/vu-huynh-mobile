import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";
import { FALLBACK_PRODUCT_IMAGE } from "../utils/imageUrl";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const featuredProduct = products[0];
  const brands = ["iPhone", "Samsung", "Xiaomi", "OPPO", "Phụ kiện"];
  const heroImage =
    "https://images.unsplash.com/photo-1695636953873-8db5f5e71fd6?q=80&w=1200&auto=format&fit=crop";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <span className="hero-eyebrow">HUYNH VU MOBILE</span>
            <h1>Chọn điện thoại đẹp, mua rõ giá, nhận máy an tâm.</h1>
            <p>
              Cửa hàng điện thoại chính hãng với trải nghiệm mua hàng gọn gàng:
              xem sản phẩm, kiểm tra giá, thêm giỏ và để shop xác nhận nhanh.
            </p>

            <div className="hero-actions">
              <a href="#products" className="btn btn-primary">
                Xem sản phẩm
              </a>
              <Link to="/cart" className="btn btn-ghost">
                Kiểm tra giỏ hàng
              </Link>
            </div>

            <div className="hero-badges">
              <span className="hero-badge">Hàng chính hãng</span>
              <span className="hero-badge">Giá rõ ràng</span>
              <span className="hero-badge">Tư vấn đúng nhu cầu</span>
            </div>
          </div>

          <div className="hero-showcase">
            <div className="hero-device-panel">
              <div className="hero-phone-frame">
                <img
                  src={heroImage}
                  alt="Điện thoại cao cấp chính hãng"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                  }}
                />
              </div>
              <div className="hero-product-strip">
                <span>Sẵn sàng tư vấn</span>
                <strong>{featuredProduct?.name || "Dòng máy mới nhất"}</strong>
                <p>
                  {featuredProduct
                    ? `${Number(featuredProduct.price || 0).toLocaleString()} đ`
                    : "Giá tốt, bảo hành rõ ràng"}
                </p>
              </div>
            </div>
            <div className="hero-deal-card">
              <span>Dịch vụ tại shop</span>
              <strong>Đặt online, xác nhận nhanh, hỗ trợ sau mua.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-band">
        <div className="container trust-grid">
          <div className="trust-item">
            <strong>01</strong>
            <span>Xem cấu hình và giá bán rõ ràng</span>
          </div>
          <div className="trust-item">
            <strong>02</strong>
            <span>Thêm giỏ, gửi thông tin nhận hàng</span>
          </div>
          <div className="trust-item">
            <strong>03</strong>
            <span>Shop gọi xác nhận trước khi giao</span>
          </div>
        </div>
      </section>

      <section className="section-space" id="products">
        <div className="container">
          <div className="brand-row" aria-label="Danh mục sản phẩm">
            {brands.map((brand) => (
              <span key={brand}>{brand}</span>
            ))}
          </div>

          <div className="section-head">
            <div>
              <h2 className="page-title">Sản phẩm nổi bật</h2>
              <p className="section-subtitle">
                Danh sách máy đang được shop cập nhật để khách chọn nhanh
              </p>
            </div>
          </div>

          {loading ? (
            <p className="empty">Đang tải sản phẩm...</p>
          ) : (
            <div className="grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
