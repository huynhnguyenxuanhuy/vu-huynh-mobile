import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../utils/imageUrl";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card">
      <div className="card-image-wrap">
        <span className="card-tag">Hot</span>
        <img src={resolveImageUrl(product.image)} alt={product.name} />
      </div>

      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="card-desc">{product.description}</p>

        <div className="price-row">
          <p className="price">{product.price.toLocaleString()} đ</p>
          <span className="brand-badge">{product.brand}</span>
        </div>

        <div className="action-row">
          <Link to={`/product/${product._id}`} className="btn btn-secondary">
            Xem chi tiết
          </Link>
          <button className="btn btn-primary" onClick={() => addToCart(product)}>
            Thêm giỏ
          </button>
        </div>
      </div>
    </div>
  );
}
