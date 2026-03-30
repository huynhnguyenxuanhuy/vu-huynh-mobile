import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { loadUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      await loadUser();
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>

        {error && (
          <p style={{ color: "red", marginBottom: 12, fontWeight: 600 }}>
            {error}
          </p>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Nhập email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            name="password"
            placeholder="Nhập mật khẩu"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Đăng nhập
        </button>

        <p style={{ marginTop: 14 }}>
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      </form>
    </div>
  );
}