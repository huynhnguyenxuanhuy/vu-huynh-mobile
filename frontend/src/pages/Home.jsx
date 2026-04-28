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
            <span className="hero-eyebrow">HUYNH VU MOBILE</span>
            <h1>Cửa hàng điện thoại chính hãng cho khách cần sự an tâm</h1>
            <p>
              Chọn máy đẹp, giá rõ ràng, tư vấn đúng nhu cầu và hỗ trợ sau bán
              hàng nghiêm túc. Tất cả sản phẩm được quản lý trực tiếp trên hệ
              thống để khách đặt hàng nhanh và minh bạch.
            </p>

            <div className="hero-badges">
              <span className="hero-badge">Máy chính hãng</span>
              <span className="hero-badge">Tư vấn kỹ trước khi mua</span>
              <span className="hero-badge">Bảo hành rõ ràng</span>
            </div>
          </div>

          <div className="hero-metrics" aria-label="Cam kết dịch vụ">
            <div>
              <strong>24h</strong>
              <span>hỗ trợ đơn hàng</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>thông tin rõ ràng</span>
            </div>
            <div>
              <strong>12T</strong>
              <span>bảo hành tiêu chuẩn</span>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-band">
        <div className="container trust-grid">
          <div>
            <span className="section-kicker">TRẢI NGHIỆM MUA HÀNG</span>
            <h2>Khách xem sản phẩm, thêm giỏ và đặt hàng trong vài bước.</h2>
          </div>
          <p>
            Mỗi sản phẩm có hình ảnh, giá bán, thương hiệu, tồn kho và mô tả rõ
            ràng. Đội ngũ quản trị có thể cập nhật sản phẩm ngay khi có hàng mới.
          </p>
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
