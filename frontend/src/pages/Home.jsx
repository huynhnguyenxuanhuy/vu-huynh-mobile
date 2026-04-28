import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <span className="hero-eyebrow">HUYNH VU MOBILE STORE</span>
            <h1>Điện thoại chính hãng, tư vấn kỹ, giao hàng nhanh.</h1>
            <p>
              Mua iPhone, Samsung, Xiaomi và các dòng máy đáng tiền với thông
              tin rõ ràng, hình ảnh thật, giá minh bạch và hỗ trợ sau bán hàng.
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
              <span className="hero-badge">Giá niêm yết rõ</span>
              <span className="hero-badge">Bảo hành minh bạch</span>
            </div>
          </div>

          <div className="hero-showcase">
            <div className="hero-phone-frame">
              <img
                src="https://images.unsplash.com/photo-1695636953873-8db5f5e71fd6?q=80&w=1200&auto=format&fit=crop"
                alt="Điện thoại cao cấp"
              />
            </div>
            <div className="hero-deal-card">
              <span>Sản phẩm nổi bật</span>
              <strong>iPhone, Samsung, Xiaomi</strong>
              <p>Đặt hàng online, shop xác nhận nhanh.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-band">
        <div className="container trust-grid">
          <div className="trust-item">
            <strong>24/7</strong>
            <span>Tư vấn và xác nhận đơn</span>
          </div>
          <div className="trust-item">
            <strong>100%</strong>
            <span>Thông tin sản phẩm rõ ràng</span>
          </div>
          <div className="trust-item">
            <strong>12T</strong>
            <span>Bảo hành tiêu chuẩn</span>
          </div>
        </div>
      </section>

      <section className="section-space" id="products">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="page-title">Sản phẩm nổi bật</h2>
              <p className="section-subtitle">
                Bộ sưu tập điện thoại đáng mua nhất hiện tại
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
