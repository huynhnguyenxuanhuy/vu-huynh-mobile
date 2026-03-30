import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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
      const res = await registerUser(form);
      localStorage.setItem("token", res.data.token);
      navigate("/login");
    } catch (error) {
      console.log("REGISTER ERROR FULL:", error);
      console.log("REGISTER ERROR RESPONSE:", error.response?.data);
      console.log("REGISTER ERROR MESSAGE:", error.message);

      setError(
        error.response?.data?.message ||
        error.message ||
        "Register failed"
      );
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Đăng ký</h2>

        {error && (
          <p style={{ color: "red", marginBottom: 12, fontWeight: 600 }}>
            {error}
          </p>
        )}

        <div className="form-group">
          <label>Họ tên</label>
          <input
            type="text"
            name="name"
            placeholder="Nhập họ tên"
            value={form.name}
            onChange={handleChange}
          />
        </div>

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
          Đăng ký
        </button>

        <p style={{ marginTop: 14 }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}