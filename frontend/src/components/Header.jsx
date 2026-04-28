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

        <nav className="nav">
          <Link to="/">Trang chủ</Link>
          <Link to="/cart">Giỏ hàng ({cartItems.length})</Link>
          {user && <Link to="/orders">Đơn hàng</Link>}
          {user?.isAdmin && (
            <div className="admin-menu">
              <Link to="/admin/dashboard" className="admin-menu-trigger">
                Admin
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
              <Link to="/register">Đăng ký</Link>
            </>
          ) : (
            <button onClick={logout}>Đăng xuất</button>
          )}
        </nav>
      </div>
    </header>
  );
}
