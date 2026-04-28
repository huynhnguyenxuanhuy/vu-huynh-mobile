import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  return (
    <header className="header">
      <div className="container header-row">
        <Link to="/" className="logo">
          HUYNH VU MOBILE
        </Link>

        <nav className="nav" aria-label="Điều hướng chính">
          <div className="nav-main">
            <Link to="/">Trang chủ</Link>
            <Link to="/cart" className="cart-link">
              Giỏ hàng <span>{cartItems.length}</span>
            </Link>
            {user && <Link to="/orders">Đơn hàng</Link>}
          </div>

          <div className="nav-account">
            {user?.isAdmin && (
              <div className="admin-menu">
                <Link to="/admin/dashboard" className="admin-menu-trigger">
                  Quản trị
                </Link>
                <div className="admin-dropdown">
                  <Link to="/admin/dashboard">Tổng quan</Link>
                  <Link to="/admin/products">Sản phẩm</Link>
                  <Link to="/admin/orders">Đơn hàng</Link>
                  <Link to="/admin/users">Người dùng</Link>
                </div>
              </div>
            )}

            {!user ? (
              <>
                <Link to="/login">Đăng nhập</Link>
                <Link to="/register" className="nav-register">
                  Đăng ký
                </Link>
              </>
            ) : (
              <button onClick={logout}>Đăng xuất</button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
