import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../utils/imageUrl";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const stock = Number(product.countInStock || 0);

  return (
    <div className="card">
      <div className="card-image-wrap">
        <span className="card-tag">{stock > 0 ? "Có hàng" : "Hết hàng"}</span>
        <img src={resolveImageUrl(product.image)} alt={product.name} />
      </div>

      <div className="card-body">
        <div className="card-meta">
          <span>{product.brand || "Điện thoại"}</span>
          <span>{stock} máy</span>
        </div>
        <h3>{product.name}</h3>
        <p className="card-desc">
          {product.description || "Sản phẩm đang được cập nhật mô tả chi tiết."}
        </p>

        <div className="price-row">
          <p className="price">{product.price.toLocaleString()} đ</p>
        </div>

        <div className="action-row">
          <Link to={`/product/${product._id}`} className="btn btn-secondary">
            Xem chi tiết
          </Link>
          <button
            className="btn btn-primary"
            onClick={() => addToCart(product)}
            disabled={stock <= 0}
          >
            Thêm giỏ
          </button>
        </div>
      </div>
    </div>
  );
}
