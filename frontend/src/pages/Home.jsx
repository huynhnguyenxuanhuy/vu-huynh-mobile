import { useEffect, useState } from "react";
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
            <h1>Điện thoại chính hãng, đẳng cấp và giá cực tốt</h1>
            <p>
              Trải nghiệm mua sắm hiện đại, giao diện sang trọng, giỏ hàng mượt,
              hỗ trợ người dùng và quản trị admin đầy đủ.
            </p>

            <div className="hero-badges">
              <span className="hero-badge">Chính hãng 100%</span>
              <span className="hero-badge">Giá cạnh tranh</span>
              <span className="hero-badge">Bảo hành uy tín</span>
            </div>
          </div>

          <div className="hero-card">
            <img
              src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1400&auto=format&fit=crop"
              alt="Hero phone"
            />
          </div>
        </div>
      </section>

      <section className="section-space">
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