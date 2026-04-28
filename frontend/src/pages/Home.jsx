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
            <span className="hero-eyebrow">HUYNH VU MOBILE - UY TÍN TẠO NIỀM TIN</span>
            <h1>Điện thoại chất lượng, giá minh bạch, bảo hành đàng hoàng.</h1>
            <p>
              Chúng tôi chọn máy kỹ, tư vấn thật, báo giá rõ ràng và đồng hành
              sau khi bán. Khách mua online vẫn được xác nhận đầy đủ trước khi giao.
            </p>

            <div className="hero-actions">
              <a href="#products" className="btn btn-primary">
                Xem máy đang bán
              </a>
              <Link to="/cart" className="btn btn-ghost">
                Kiểm tra đơn hàng
              </Link>
            </div>

            <div className="hero-badges">
              <span className="hero-badge">Uy tín trong từng giao dịch</span>
              <span className="hero-badge">Máy chất lượng, rõ nguồn gốc</span>
              <span className="hero-badge">Bảo hành có trách nhiệm</span>
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
                <span>Cam kết chất lượng</span>
                <strong>{featuredProduct?.name || "Máy đẹp, nguồn gốc rõ ràng"}</strong>
                <p>
                  {featuredProduct
                    ? `${Number(featuredProduct.price || 0).toLocaleString()} đ`
                    : "Tư vấn kỹ trước khi chốt đơn"}
                </p>
              </div>
            </div>
            <div className="hero-deal-card">
              <span>Dịch vụ tại shop</span>
              <strong>Mua đúng nhu cầu, nhận đúng máy, hỗ trợ rõ ràng sau mua.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-band">
        <div className="container trust-grid">
          <div className="trust-item">
            <strong>01</strong>
            <span>Kiểm tra chất lượng trước khi đăng bán</span>
          </div>
          <div className="trust-item">
            <strong>02</strong>
            <span>Báo giá minh bạch, không mập mờ chi phí</span>
          </div>
          <div className="trust-item">
            <strong>03</strong>
            <span>Xác nhận đơn và bảo hành có trách nhiệm</span>
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
                Những mẫu máy được chọn lọc, cập nhật rõ giá để khách dễ so sánh
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
