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
          VU HUYNH MOBILE
        </Link>

        <nav className="nav">
          <Link to="/">Trang chủ</Link>
          <Link to="/cart">Giỏ hàng ({cartItems.length})</Link>
          {user && <Link to="/orders">Đơn hàng</Link>}
          {user?.isAdmin && <Link to="/admin/dashboard">Admin</Link>}

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